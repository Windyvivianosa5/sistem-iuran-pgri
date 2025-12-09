'use client';

import { Head, usePage } from '@inertiajs/react';
import { pdf } from '@react-pdf/renderer';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import AppAdminLayout from '@/layouts/app-admin-layout';
import { type BreadcrumbItem } from '@/types';

import { generateLaporan } from '@/utils/filterLaporan';
import { formatTanggalSekarang } from '@/utils/formatdate';
import { formatCurrency } from '@/utils/formatRupiah';
import { getRentangBulan } from '@/utils/rentangBulan';
import { terbilang } from '@/utils/terbilang';

import DocumentPDF from '../pdf/document';
import KwitansiPDF from '../pdf/kwitansi';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard Admin', href: 'admin/dashboard/laporan' }];

export default function DashboardAdminLaporan() {
    const { iuran } = usePage().props as any;

    const [datas, setDatas] = useState([]);
    const [yearSelect, setYearSelect] = useState(new Date().getFullYear().toString());
    const [isOpen, setIsOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const currentYear = 2024;
    const years = Array.from({ length: 5 }, (_, i) => 2024 + i);

    const handleFilterYear = (year: string) => {
        const laporan: any = generateLaporan(iuran, parseInt(year));
        setDatas(laporan);
        setYearSelect(year); // tambah ini supaya yearSelect konsisten
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

    useEffect(() => {
        handleFilterYear(yearSelect);
    }, [yearSelect]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <AppAdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="space-y-6 p-6">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-100 via-blue-50 to-white p-6 shadow-sm dark:from-blue-900/50 dark:to-gray-900"
                >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300">📊 Rekapitulasi Iuran Kabupaten/Kota</h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan total pemasukan iuran berdasarkan bulan dan kabupaten untuk tahun {yearSelect}.
                            </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <Button onClick={handlePrintAll} className="bg-blue-600 text-white shadow-md hover:bg-blue-700">
                                🖨️ Print Semua
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Select Tahun */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-4"
                >
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
                </motion.div>

                {/* Tabel Laporan */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mx-auto w-full px-4 md:max-w-[660px] xl:max-w-[1200px]"
                >
                    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:bg-gray-900">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white">
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
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {datas.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={20} className="py-4 text-center text-gray-500">
                                            Data laporan belum tersedia.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {datas.map((item: any, index: number) => (
                                    <TableRow key={item.kabupaten} className="hover:bg-blue-50 dark:hover:bg-gray-800">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium text-blue-800 dark:text-blue-300">{item.kabupaten}</TableCell>
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
                                        <TableCell className="font-semibold text-green-700 dark:text-green-400">
                                            {formatCurrency(item.totalIuran)}
                                        </TableCell>
                                        <TableCell>{formatCurrency(item.totalSeharusnya)}</TableCell>
                                        <TableCell className={item.kekurangan > 0 ? 'font-bold text-red-500' : 'text-gray-600'}>
                                            Rp. {item.kekurangan.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-fit">
                                                    <DropdownMenuItem onClick={() => handlePrint(item)}>🧾 Unduh Kwitansi</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>
            </div>
        </AppAdminLayout>
    );
}
