export function terbilang(nilai: number): string {
    const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

    function convert(n: number): string {
        if (n < 12) {
            return satuan[n];
        } else if (n < 20) {
            return `${convert(n - 10)} Belas`;
        } else if (n < 100) {
            return `${convert(Math.floor(n / 10))} Puluh ${convert(n % 10)}`.trim();
        } else if (n < 200) {
            return `Seratus ${convert(n - 100)}`.trim();
        } else if (n < 1000) {
            return `${convert(Math.floor(n / 100))} Ratus ${convert(n % 100)}`.trim();
        } else if (n < 2000) {
            return `Seribu ${convert(n - 1000)}`.trim();
        } else if (n < 1000000) {
            return `${convert(Math.floor(n / 1000))} Ribu ${convert(n % 1000)}`.trim();
        } else if (n < 1000000000) {
            return `${convert(Math.floor(n / 1000000))} Juta ${convert(n % 1000000)}`.trim();
        } else {
            return 'Angka terlalu besar';
        }
    }

    return `${convert(nilai)} Rupiah`;
}
