'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import AppAdminLayout from '@/layouts/app-admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Banknote, Bell, Building2, ChevronDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin Master',
        href: 'admin/dashboard',
    },
];

const chartConfig = {
    pemasukan: {
        label: 'Pemasukan',
        color: '#22c55e',
    },
    totalIuran: {
        label: 'Total Iuran',
        color: '#3b82f6',
    },
} satisfies ChartConfig;

export default function DashboardAdmin() {
    const {
        laporans = [],
        totalMasuk = 0,
        jumlahTransaksi = 0,
        transaksiTerbaru = [],
        totalKabupaten = 0,
        notifikasi = [],
        laporanKabupaten = [],
    } = usePage().props as any;

    const [filterType, setFilterType] = useState('monthly'); // 'monthly' atau 'highest'
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const chartData = laporans.map((laporan: any) => ({
        month: laporan.bulan,
        pemasukan: laporan.total_iuran,
    }));

    const getHighestIuranData = (laporans: any[]) => {
        return laporans
            .map((laporan: any) => ({
                kabupaten: laporan.kabupaten,
                totalIuran: laporan.total_iuran,
                jumlahTransaksi: laporan.jumlah_transaksi,
                status: laporan.status,
            }))
            .sort((a, b) => b.totalIuran - a.totalIuran); // Tampilkan semua data, termasuk yang 0
    };

    const highestIuranData = getHighestIuranData(laporanKabupaten);

    console.log('laporanKabupaten:', laporanKabupaten);
    console.log('highestIuranData:', highestIuranData);

    const growthPercentage =
        chartData.length >= 2
            ? (
                  ((chartData[chartData.length - 1].pemasukan - chartData[chartData.length - 2].pemasukan) /
                      (chartData[chartData.length - 2].pemasukan || 1)) *
                  100
              ).toFixed(2)
            : '0';

    const filterOptions = [
        { value: 'monthly', label: '📈 Pemasukan Bulanan' },
        { value: 'highest', label: '🏆 Kabupaten Tertinggi' },
    ];

    const selectedFilter = filterOptions.find((option) => option.value === filterType);

    return (
        <AppAdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

            {/* Banner Sambutan */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 rounded-xl border-l-4 border-red-400 bg-gradient-to-r from-red-100 to-pink-100 p-6 shadow-md"
            >
                <h1 className="text-2xl font-bold text-red-700">Selamat Datang di Dashboard Admin PGRI</h1>
                <p className="mt-1 text-sm text-red-600">Pantau seluruh aktivitas iuran dan laporan dengan mudah & cepat.</p>
            </motion.div>

            <div className="flex flex-col gap-6">
                {/* Stat Cards */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <Card className="border border-red-300 bg-white shadow hover:shadow-lg">
                        <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div>
                                <p className="text-sm text-gray-500">Total Saldo Masuk</p>
                                <p className="text-2xl font-bold text-red-600">Rp {Number(totalMasuk).toLocaleString()}</p>
                            </div>
                            <Banknote className="h-8 w-8 text-red-500" />
                        </CardContent>
                    </Card>
                    <Card className="border border-green-300 bg-white shadow hover:shadow-lg">
                        <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div>
                                <p className="text-sm text-gray-500">Jumlah Transaksi</p>
                                <p className="text-2xl font-bold text-green-600">{jumlahTransaksi}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </CardContent>
                    </Card>
                    <Card className="border border-blue-300 bg-white shadow hover:shadow-lg">
                        <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div>
                                <p className="text-sm text-gray-500">Jumlah Kabupaten/Kota</p>
                                <p className="text-2xl font-bold text-blue-600">{laporanKabupaten.length}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-blue-500" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Grafik dengan Filter */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <Card className="bg-white shadow-md">
                        <CardContent className="p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-md font-semibold">📊 Grafik Data</h3>

                                {/* Custom Dropdown Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {selectedFilter?.label}
                                        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                            {filterOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setFilterType(option.value);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                                        filterType === option.value ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="!h-[400px] w-full">
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    {filterType === 'monthly' ? (
                                        <LineChart width={800} height={300} data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                tickLine={{ stroke: '#64748b' }}
                                                axisLine={{ stroke: '#64748b' }}
                                                tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                tickLine={{ stroke: '#64748b' }}
                                                axisLine={{ stroke: '#64748b' }}
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)} Juta`}
                                            />
                                            <ChartTooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                                                                <p className="font-medium">{label}</p>
                                                                <p className="text-green-600">
                                                                    Pemasukan: Rp {Number(payload[0].value).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="pemasukan"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                                                activeDot={{ r: 8, fill: '#16a34a' }}
                                            />
                                        </LineChart>
                                    ) : (
                                        <LineChart width={800} height={300} data={highestIuranData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="kabupaten"
                                                tick={{ fontSize: 10, fill: '#64748b' }}
                                                tickLine={{ stroke: '#64748b' }}
                                                axisLine={{ stroke: '#64748b' }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                interval={0}
                                                tickFormatter={(value) => {
                                                    // Memotong nama kabupaten untuk tampilan yang lebih baik
                                                    const words = value.split(' ');
                                                    if (words.length > 2) {
                                                        return words.slice(1, 3).join(' '); // Ambil kata ke-2 dan ke-3
                                                    }
                                                    return value;
                                                }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                tickLine={{ stroke: '#64748b' }}
                                                axisLine={{ stroke: '#64748b' }}
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)} Juta`}
                                            />
                                            <ChartTooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                                                                <p className="font-medium">{label}</p>
                                                                <p className="text-blue-600">
                                                                    Total Iuran: Rp {Number(payload[0].value).toLocaleString()}
                                                                </p>
                                                                <p className="text-gray-600">
                                                                    Jumlah Transaksi: {payload[0].payload.jumlahTransaksi}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="totalIuran"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                                                activeDot={{ r: 8, fill: '#2563eb' }}
                                            />
                                        </LineChart>
                                    )}
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Transaksi & Notifikasi */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Card className="hover:shadow-md">
                            <CardContent className="p-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">📑 Transaksi Terbaru</h3>
                                    <TrendingUp className="h-5 w-5 text-gray-500" />
                                </div>
                                <table className="w-full text-sm text-gray-700">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="py-2">Bulan</th>
                                            <th className="py-2">Kabupaten</th>
                                            <th className="py-2">Total Iuran</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transaksiTerbaru.map((item: any, index: number) => (
                                            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} transition hover:bg-gray-100`}>
                                                <td className="py-2">{item.bulan}</td>
                                                <td className="py-2">{item.kabupaten}</td>
                                                <td className="py-2">Rp {Number(item.total_iuran).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <Card className="hover:shadow-md">
                            <CardContent className="p-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">🔔 Notifikasi</h3>
                                    <Bell className="h-5 w-5 text-gray-500" />
                                </div>
                                <ul className="space-y-2 text-sm">
                                    {notifikasi.map((item: any, index: number) => (
                                        <li key={index} className="flex items-center justify-between border-b pb-2 hover:text-blue-600">
                                            <a
                                                href={route('admin.dashboard.notifikasi.show', item.id)}
                                                className="flex-1 text-blue-700 hover:underline"
                                            >
                                                <span className="mr-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                                                    Baru
                                                </span>
                                                {item.pesan}
                                            </a>
                                            <span className="text-xs text-gray-500">{item.waktu}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppAdminLayout>
    );
}
