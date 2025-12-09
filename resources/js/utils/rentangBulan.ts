const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function getRentangBulan(iuranItem: any): string {
    const bulanAktif: string[] = [];

    namaBulan.forEach((bulan, index) => {
        const key = bulan.toLowerCase(); // Sesuai key dari `item.januari`, `item.februari`, dst.
        if (iuranItem[key] && iuranItem[key] > 0) {
            bulanAktif.push(bulan);
        }
    });

    if (bulanAktif.length === 0) return '-';
    if (bulanAktif.length === 1) return `${bulanAktif[0]} 2024`;

    return `${bulanAktif[0]} – ${bulanAktif[bulanAktif.length - 1]} 2024`;
}
