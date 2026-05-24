import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const signature = request.headers.get('x-paystack-signature');
    if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!).update(rawBody).digest('hex');
    if (hash !== signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    if (body.event === 'charge.success') {
      const orderId = body.data.metadata?.order_id;
      if (orderId) {
        await supabaseAdmin.from('orders').update({ status: 'paid' }).eq('id', orderId);
        const { data: order } = await supabaseAdmin.from('orders').select('items').eq('id', orderId).single();
        if (order?.items) for (const item of order.items as any[]) {
          if (item.variant_id) await supabaseAdmin.rpc('decrease_variant_stock', { variant_id: item.variant_id, qty: item.quantity });
          else if (item.product_id) await supabaseAdmin.rpc('decrease_product_stock', { product_id: item.product_id, qty: item.quantity });
        }
      }
    }
    return NextResponse.json({ status: 'success' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';