import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paystackRef = `DPILOT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { data: order, error } = await supabaseAdmin.from('orders').insert([{ customer_name: body.customer_name, customer_email: body.customer_email, customer_phone: body.customer_phone, customer_address: body.customer_address, items: body.items, total_amount: body.total_amount, status: 'pending', paystack_reference: paystackRef }]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ orderId: order.id, paystackReference: paystackRef });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}