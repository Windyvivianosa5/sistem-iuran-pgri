export function formatRupiah(angka: number | null | undefined): string {
    if (!angka || angka === 0) return 'Rp. -';
    return `Rp. ${Number(angka).toLocaleString('id-ID')}`;
}

export const formatCurrency = (value: any) => {
    return value === 0 ? 'Rp. -' : `Rp. ${value.toLocaleString().replace(/,/g, '.')}`;
};
