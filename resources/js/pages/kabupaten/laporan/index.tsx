'use client';

import { Head, usePage } from '@inertiajs/react';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { type BreadcrumbItem } from '@/types';

import { generateLaporan } from '@/utils/filterLaporan';
import { formatTanggalSekarang } from '@/utils/formatdate';
import { getRentangBulan } from '@/utils/rentangBulan';
import { terbilang } from '@/utils/terbilang';

import AppLayout from '@/layouts/app-layout';
import DocumentPDF from '@/pages/admin/pdf/document';
import KwitansiPDF from '@/pages/admin/pdf/kwitansi';
import { formatCurrency } from '@/utils/formatRupiah';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Kabupaten', href: '/kabupaten/dashboard' },
    { title: 'Laporan', href: '/kabupaten/dashboard/laporan' },
];

export default function DashboardKabupatenLaporan() {
    const { iuran } = usePage().props as any;
    const { auth } = usePage().props as any;
    const [datas, setDatas] = useState([]);
    const [yearSelect, setYearSelect] = useState(new Date().getFullYear().toString());
    const [isOpen, setIsOpen] = useState(false);
    const [dataKwitansi, setDataKwitansi] = useState({});
    // Year input ref
    const inputRef = useRef<HTMLInputElement>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

    const handleFilterYear = (year: string) => {
        const laporan: any = generateLaporan(iuran, parseInt(year));
        setDatas(laporan);
    };

    const handlePrintAll = async () => {
        const blob = await pdf(<DocumentPDF data={datas} tahun={yearSelect} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url);
    };

    const handlePrint = async (data: any) => {
        const jumlahTerbilang = terbilang(data.totalIuran);
        const bulanAktif = getRentangBulan(data);
        const tanggalCetak = formatTanggalSekarang();

        const blob = await pdf(
            <KwitansiPDF
                data={{
                    namaKabupaten: data.kabupaten,
                    jumlah: `Rp. ${data.totalIuran.toLocaleString()}`,
                    jumlahTerbilang,
                    bulan: bulanAktif,
                    tanggalCetak,
                }}
            />,
        ).toBlob();

        const url = URL.createObjectURL(blob);
        window.open(url);
    };
    const handleKwitansi = (datas: any) => {
        datas.map((data: any) => {
            if (data.kabupaten === auth.user.name) {
                setDataKwitansi(data);
            }
        });
    };

    useEffect(() => {
        handleFilterYear(yearSelect);
    }, [yearSelect]);

    useEffect(() => {
        handleKwitansi(datas);
        console.log(dataKwitansi);
    });

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="w-full overflow-hidden p-6">
                {/* Select Tahun */}
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Select onValueChange={setYearSelect} open={isOpen} onOpenChange={setIsOpen}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder={yearSelect} />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="px-2 pt-2 pb-1">
                                    <Input
                                        ref={inputRef}
                                        type="number"
                                        placeholder="Tulis manual"
                                        onKeyDown={(e) => {
                                            e.stopPropagation();
                                            if (e.key === 'Enter') {
                                                setYearSelect(e.currentTarget.value);
                                            }
                                        }}
                                    />
                                </div>
                                {years.map((tahun) => (
                                    <SelectItem key={tahun} value={tahun.toString()}>
                                        {tahun}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={handlePrintAll}>Print Semua</Button>
                    </div>
                    <Button onClick={() => handlePrint(dataKwitansi)}>Kwitansi</Button>
                </div>

                {/* Table Laporan */}
                <div className="mx-auto w-full px-4 md:max-w-[660px] xl:max-w-[1220px]">
                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Kabupaten</TableHead>
                                    <TableHead>Jumlah Anggota</TableHead>
                                    {[
                                        'Januari',
                                        'Februari',
                                        'Maret',
                                        'April',
                                        'Mei',
                                        'Juni',
                                        'Juli',
                                        'Agustus',
                                        'September',
                                        'Oktober',
                                        'November',
                                        'Desember',
                                    ].map((bulan) => (
                                        <TableHead key={bulan}>{bulan}</TableHead>
                                    ))}
                                    <TableHead>Total Iuran</TableHead>
                                    <TableHead>Total Seharusnya</TableHead>
                                    <TableHead>Kekurangan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {datas.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={20} className="text-center">
                                            Data laporan belum tersedia.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {datas.map((item: any, index: number) => {
                                    return (
                                        <TableRow key={item.kabupaten}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.kabupaten}</TableCell>
                                            <TableCell>{item.jumlahAnggota}</TableCell>
                                            <TableCell>{formatCurrency(item.januari)}</TableCell>
                                            <TableCell>{formatCurrency(item.februari)}</TableCell>
                                            <TableCell>{formatCurrency(item.maret)}</TableCell>
                                            <TableCell>{formatCurrency(item.april)}</TableCell>
                                            <TableCell>{formatCurrency(item.mei)}</TableCell>
                                            <TableCell>{formatCurrency(item.juni)}</TableCell>
                                            <TableCell>{formatCurrency(item.juli)}</TableCell>
                                            <TableCell>{formatCurrency(item.agustus)}</TableCell>
                                            <TableCell>{formatCurrency(item.september)}</TableCell>
                                            <TableCell>{formatCurrency(item.oktober)}</TableCell>
                                            <TableCell>{formatCurrency(item.november)}</TableCell>
                                            <TableCell>{formatCurrency(item.desember)}</TableCell>
                                            <TableCell>{formatCurrency(item.totalIuran)}</TableCell>
                                            <TableCell>{formatCurrency(item.totalSeharusnya)}</TableCell>
                                            <TableCell className={item.kekurangan > 0 ? 'font-bold text-red-500' : ''}>
                                                Rp. {item.kekurangan.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
