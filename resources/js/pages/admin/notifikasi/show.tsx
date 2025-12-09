'use client';

import AppAdminLayout from '@/layouts/app-admin-layout';
import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck, Clock, FileDown, XCircle, Landmark, CalendarCheck, Coins } from 'lucide-react';

export default function Show() {
    const { notifikasi }: any = usePage().props;

    const statusBadge = (status: string) => {
        if (status === 'diterima') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <BadgeCheck className="h-4 w-4" /> Diterima
                </span>
            );
        } else if (status === 'ditolak') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    <XCircle className="h-4 w-4" /> Ditolak
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    <Clock className="h-4 w-4" /> Pending
                </span>
            );
        }
    };

    return (
        <AppAdminLayout
            breadcrumbs={[
                { title: 'Notifikasi', href: route('admin.dashboard.notifikasi.index') },
                { title: 'Detail Notifikasi', href: '#' },
            ]}
        >
            <Head title="Detail Notifikasi" />

            <div className="space-y-6 p-6">
                {/* Judul Halaman */}
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
                    📄 Detail Notifikasi
                </h1>

                {/* Panel Deskripsi */}
                <div className="rounded-xl border-l-8 border-blue-500 bg-blue-50 p-5 shadow-sm dark:border-blue-400 dark:bg-blue-900/30">
                    <p className="text-base font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        📝 Deskripsi:
                    </p>
                    <p className="mt-2 text-lg text-blue-900 dark:text-blue-100 italic">
                        "{notifikasi.deskripsi}"
                    </p>
                </div>

                {/* Informasi Rincian */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Wilayah */}
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Landmark className="h-4 w-4" />
                                Wilayah
                            </p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                                {notifikasi.kabupaten?.tipe ?? 'Kabupaten'} {notifikasi.kabupaten?.name}
                            </p>
                        </div>

                        {/* Jumlah */}
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Coins className="h-4 w-4" />
                                Jumlah Iuran
                            </p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {notifikasi.jumlah
                                    ? `Rp ${parseInt(notifikasi.jumlah).toLocaleString()}`
                                    : 'Rp -'}
                            </p>
                        </div>

                        {/* Tanggal */}
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <CalendarCheck className="h-4 w-4" />
                                Tanggal
                            </p>
                            <p className="text-base text-gray-800 dark:text-white">{notifikasi?.tanggal}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <p className="text-sm text-gray-500">Status Verifikasi</p>
                            <div className="mt-1">{statusBadge(notifikasi?.terverifikasi)}</div>
                        </div>

                        {/* Bukti Transaksi */}
                        <div className="col-span-full">
                            <p className="mb-1 text-sm text-gray-500">Bukti Transaksi</p>
                            {notifikasi?.bukti_transaksi ? (
                                <a
                                    href={`/storage/${notifikasi.bukti_transaksi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-800/40 dark:text-blue-300 dark:hover:bg-blue-800"
                                >
                                    <FileDown className="h-4 w-4" />
                                    Lihat / Unduh Bukti
                                </a>
                            ) : (
                                <span className="text-gray-500">Tidak ada bukti transaksi</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppAdminLayout>
    );
}
