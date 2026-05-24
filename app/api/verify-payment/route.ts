import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyPaystackTransaction } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const { reference, orderId } = await request.json();
    const data = await verifyPaystackTransaction(reference);
    if (data.status && data.data.status === 'success') {
      await supabaseAdmin.from('orders').update({ status: 'paid' }).eq('id', orderId);
      const { data: order } = await supabaseAdmin.from('orders').select('items').eq('id', orderId).single();
      if (order?.items) for (const item of order.items as any[]) {
        if (item.variant_id) await supabaseAdmin.rpc('decrease_variant_stock', { variant_id: item.variant_id, qty: item.quantity });
        else if (item.product_id) await supabaseAdmin.rpc('decrease_product_stock', { product_id: item.product_id, qty: item.quantity });
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Payment not successful' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}