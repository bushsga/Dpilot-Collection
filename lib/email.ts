'use client';

import emailjs from '@emailjs/browser';

export const sendOrderEmails = async (orderData: {
  orderId: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items_list: string;
  total_amount: number;
}) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const customerTemplateId = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID!;
  const adminTemplateId = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID!;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  await emailjs.send(serviceId, customerTemplateId, {
    customer_name: orderData.customer_name,
    order_id: orderData.orderId,
    total_amount: orderData.total_amount.toLocaleString(),
    items_list: orderData.items_list,
    to_email: orderData.customer_email,
  }, publicKey);

  await emailjs.send(serviceId, adminTemplateId, {
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone,
    customer_address: orderData.customer_address,
    order_id: orderData.orderId,
    total_amount: orderData.total_amount.toLocaleString(),
    items_list: orderData.items_list,
    to_email: 'dpilot241@gmail.com',
  }, publicKey);
};