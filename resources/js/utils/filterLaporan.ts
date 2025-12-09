type LaporanPerKabupaten = {
    kabupaten: string;
    jumlahAnggota: number;
    iuran: number;
    januari: number;
    februari: number;
    maret: number;
    april: number;
    mei: number;
    juni: number;
    juli: number;
    agustus: number;
    september: number;
    oktober: number;
    november: number;
    desember: number;
    totalIuran: number;
    totalSeharusnya: number;
    kekurangan: number;
};

export function generateLaporan(data: any[], tahun = new Date().getFullYear()) {
    const IURAN_TETAP_BASE = tahun == 2024 ? 1200 : 1600; // 2023-24(1200),2025 dari januari (1600)

    const IURAN_TETAP = IURAN_TETAP_BASE + (new Date().getFullYear() - tahun) * 400;

    const bulanMap = [
        'januari',
        'februari',
        'maret',
        'april',
        'mei',
        'juni',
        'juli',
        'agustus',
        'september',
        'oktober',
        'november',
        'desember',
    ] as const;

    const semuaKabupaten = [
        'Pekanbaru',
        'Dumai',
        'Kampar',
        'Rokan Hulu',
        'Rokan Hilir',
        'Bengkalis',
        'Siak',
        'Pelalawan',
        'Indragiri Hulu',
        'Indragiri Hilir',
        'Kepulauan Meranti',
        'Kuantan Singingi',
    ];

    const result: Record<string, LaporanPerKabupaten> = {};

    // Filter data sesuai tahun dan status verifikasi
    const filteredData = data.filter((item: any) => {
        const tanggal = new Date(item.tanggal);
        return item.terverifikasi === 'diterima' && tanggal.getFullYear() === tahun;
    });

    // Proses data transaksi yang difilter
    filteredData.forEach((item: any) => {
        const tanggal = new Date(item.tanggal);
        const kabupatenName = item.kabupaten.name;
        const anggota = item.kabupaten.anggota;
        const bulanIndex = tanggal.getMonth();
        const bulanKey = bulanMap[bulanIndex];
        const jumlah = parseFloat(item.jumlah);

        if (!result[kabupatenName]) {
            result[kabupatenName] = {
                kabupaten: kabupatenName,
                jumlahAnggota: anggota,
                iuran: IURAN_TETAP,
                januari: 0,
                februari: 0,
                maret: 0,
                april: 0,
                mei: 0,
                juni: 0,
                juli: 0,
                agustus: 0,
                september: 0,
                oktober: 0,
                november: 0,
                desember: 0,
                totalIuran: 0,
                totalSeharusnya: anggota * IURAN_TETAP_BASE * 12,
                kekurangan: 0,
            };
        }

        result[kabupatenName][bulanKey] += jumlah;
        result[kabupatenName].totalIuran += jumlah;
    });

    // Pastikan semua kabupaten tetap muncul, walau tanpa data
    semuaKabupaten.forEach((kab) => {
        if (!result[kab]) {
            result[kab] = {
                kabupaten: kab,
                jumlahAnggota: 0,
                iuran: IURAN_TETAP,
                januari: 0,
                februari: 0,
                maret: 0,
                april: 0,
                mei: 0,
                juni: 0,
                juli: 0,
                agustus: 0,
                september: 0,
                oktober: 0,
                november: 0,
                desember: 0,
                totalIuran: 0,
                totalSeharusnya: 0,
                kekurangan: 0,
            };
        }
    });

    // Hitung kekurangan iuran
    Object.values(result).forEach((row) => {
        row.kekurangan = row.totalSeharusnya - row.totalIuran;
    });

    return Object.values(result);
}
