// Hardcoded fallback for production
export const PAYSTACK_PUBLIC_KEY = 
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 
  'pk_test_af9d4f228af98e5c38b4689a99cb87f5ea279c02'; // ← Replace with your real test public key

export const PAYSTACK_SECRET_KEY = 
  process.env.PAYSTACK_SECRET_KEY || 
  'sk_test_623c727a73bd0bac94ef8b8c277bc8fe05e94277'; // ← Replace with your real test secret key

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return await response.json();
}