export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}