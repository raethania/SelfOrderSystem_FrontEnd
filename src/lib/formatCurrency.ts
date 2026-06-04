/**
 * Format a number as Indonesian Rupiah currency.
 * Example: formatRupiah(25000) → "Rp. 25.000"
 */
export function formatRupiah(price: number): string {
    return `Rp. ${Number(price).toLocaleString("id-ID")}`;
}
