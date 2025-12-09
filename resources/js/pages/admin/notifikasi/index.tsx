'use client';

import AppAdminLayout from '@/layouts/app-admin-layout';
import { formatTanggalIndonesiaManual } from '@/utils/formatdate';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Eye, XCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function NotifikasiIndex() {
    const { notifikasis }: any = usePage().props;

    const handleApprove = (id: number) => {
        if (confirm('Apakah Anda yakin ingin konfirmasi notifikasi ini?')) {
            Inertia.post(
                route('admin.dashboard.notifikasi.markAsRead', id),
                {},
                {
                    onSuccess: () => toast.success('Notifikasi telah dikonfirmasi ✅'),
                },
            );
        }
    };

    const handleCancel = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan notifikasi ini?')) {
            Inertia.post(
                route('admin.dashboard.notifikasi.markAsCancel', id),
                {},
                {
                    onSuccess: () => toast.success('Notifikasi dibatalkan ❌'),
                },
            );
        }
    };

    // const handleApproveAll = () => {
    //     if (confirm('Yakin ingin meng-ACC semua notifikasi yang masih pending?')) {
    //         Inertia.post(
    //             route('admin.dashboard.notifikasi.markAllAsRead'),
    //             {},
    //             {
    //                 onSuccess: () => toast.success('Semua notifikasi pending telah di-ACC ✅'),
    //             },
    //         );
    //     }
    // };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diterima':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                        <CheckCircle className="h-4 w-4" /> Diterima
                    </span>
                );
            case 'ditolak':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                        <XCircle className="h-4 w-4" /> Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-600">
                        <Clock className="h-4 w-4" /> Pending
                    </span>
                );
        }
    };

    return (
        <AppAdminLayout breadcrumbs={[{ title: 'Notifikasi', href: route('admin.dashboard.notifikasi.index') }]}>
            <Head title="Notifikasi Admin" />
            <Toaster position="top-right" />

            <div className="p-6">
                <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">📬 Daftar Notifikasi</h1>

                {notifikasis.some((n: any) => n.terverifikasi === 'pending') && (
                    <div className="mb-4">
                        {/* <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={handleApproveAll}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                        >
                            ✅ ACC Semua Notifikasi Pending
                        </motion.button> */}
                    </div>
                )}

                {notifikasis.length === 0 ? (
                    <div className="rounded-md bg-gray-50 p-4 text-gray-500 shadow-sm">Tidak ada notifikasi yang masuk.</div>
                ) : (
                    <ul className="space-y-6">
                        {notifikasis.map((notif: any, index: number) => (
                            <motion.li
                                key={notif.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
                            >
                                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white shadow-lg ring-2 ring-white transition-transform duration-200 ease-out hover:scale-105">
                                    {index + 1}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <Link
                                            href={route('admin.dashboard.notifikasi.show', notif.id)}
                                            className="text-lg font-bold text-indigo-700 hover:underline"
                                        >
                                            {notif.kabupaten?.name}
                                        </Link>
                                        <p className="text-sm text-gray-600">{notif.deskripsi}</p>
                                        <p className="text-sm text-gray-400">{formatTanggalIndonesiaManual(notif.tanggal)}</p>
                                        {notif.jumlah && (
                                            <p className="mt-1 text-sm font-medium text-green-600">💰 Rp {Number(notif.jumlah).toLocaleString()}</p>
                                        )}
                                        {notif.kabupaten?.name && (
                                            <p className="text-xs text-gray-500">👤 Dikirim oleh Admin {notif.kabupaten.name}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(notif.terverifikasi)}
                                        <Link
                                            href={route('admin.dashboard.notifikasi.show', notif.id)}
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Lihat Detail
                                        </Link>
                                        {notif.terverifikasi === 'pending' && (
                                            <div className="mt-2 flex gap-2">
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => handleApprove(notif.id)}
                                                    className="rounded-md bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                                                >
                                                    ACC
                                                </motion.button>
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => handleCancel(notif.id)}
                                                    className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                                >
                                                    Cancel
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </div>
        </AppAdminLayout>
    );
}
