import { formatRupiah } from '@/utils/formatRupiah';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Tipe data
type KabupatenData = {
    kabupaten: string;
    jumlahAnggota: number;
    iuran: number;
    totalIuran: number;
    totalSeharusnya: number;
    kekurangan: number;
};

// Gaya PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: '#fff',
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '6%',
        minHeight: 20,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#fefe33',
        padding: 2,
    },
    tableCol: {
        width: '6%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 2,
    },
    tableColTotal: {
        width: '6%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#e6f3ff',
        padding: 2,
    },
    tableCell: {
        fontSize: 6,
        textAlign: 'center',
    },
    tableCellBold: {
        fontSize: 6,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

const DocumentPDF = ({ data = [], tahun }: { data?: any; tahun: any }) => {
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    function calculateTotal(data: any[], field: string): number {
        return data.reduce((sum, item) => sum + (item[field] || 0), 0);
    }

    const monthFields = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return (
        <Document>
            <Page size="A4" style={styles.page} orientation="landscape">
                <Text style={{ fontSize: 14, marginBottom: 10, textAlign: 'center' }}>IURAN WAJIB PGRI KABUPATEN/KOTA </Text>
                <Text style={{ fontSize: 14, marginBottom: 10, textAlign: 'center' }}>{tahun}</Text>
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCell}>Kabupaten</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCell}>Anggota</Text>
                        </View>
                        {monthNames.map((bulan, i) => (
                            <View key={i} style={styles.tableColHeader}>
                                <Text style={styles.tableCell}>{bulan}</Text>
                            </View>
                        ))}
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCell}>Total Iuran</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCell}>Seharusnya</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCell}>Kekurangan</Text>
                        </View>
                    </View>

                    {/* Baris data */}
                    {Array.isArray(data) &&
                        data.map((item, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{item.kabupaten}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{item.jumlahAnggota}</Text>
                                </View>
                                {monthFields.map((field, i) => (
                                    <View key={i} style={styles.tableCol}>
                                        <Text style={styles.tableCell}> {formatRupiah(item[field] || 0)}</Text>
                                    </View>
                                ))}
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}> {formatRupiah(item.totalIuran || 0)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}> {formatRupiah(item.totalSeharusnya || 0)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}> {formatRupiah(item.kekurangan || 0)}</Text>
                                </View>
                            </View>
                        ))}

                    {/* Baris Total - Di dalam struktur tabel */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColTotal}>
                            <Text style={styles.tableCellBold}>TOTAL</Text>
                        </View>
                        <View style={styles.tableColTotal}>
                            <Text style={styles.tableCellBold}>
                                {Array.isArray(data) ? data.reduce((sum: number, item: any) => sum + (item.jumlahAnggota || 0), 0) : 0}
                            </Text>
                        </View>
                        {monthFields.map((field, i) => (
                            <View key={i} style={styles.tableColTotal}>
                                <Text style={styles.tableCellBold}> {formatRupiah(calculateTotal(data, field))}</Text>
                            </View>
                        ))}
                        <View style={styles.tableColTotal}>
                            <Text style={styles.tableCellBold}> {formatRupiah(calculateTotal(data, 'totalIuran'))}</Text>
                        </View>
                        <View style={styles.tableColTotal}>
                            <Text style={styles.tableCellBold}> {formatRupiah(calculateTotal(data, 'totalSeharusnya'))}</Text>
                        </View>
                        <View style={styles.tableColTotal}>
                            <Text style={styles.tableCellBold}> {formatRupiah(calculateTotal(data, 'kekurangan'))}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
                    {/* Kolom kiri: info rekening */}
                    <View>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>Rekening Pengurus PGRI Provinsi Riau</Text>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>BRI</Text>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>69601003425563,00</Text>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>Nomor WA Ibu Aslindawati : 085355511927</Text>
                    </View>

                    {/* Kolom kanan: tanda tangan */}
                    <View style={{ alignItems: 'center', marginRight: 20 }}>
                        <Text style={{ fontSize: 8, marginBottom: 8 }}>Pekanbaru, {tanggalCetak}</Text>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>PENGURUS PGRI PROVINSI RIAU</Text>
                        <Text style={{ fontSize: 8, marginBottom: 48 }}>BENDAHARA,</Text>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>Aslindawati, S.Pd., M.M</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default DocumentPDF;
