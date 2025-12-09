'use client';

import { generateLaporan } from '@/utils/filterLaporan';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart2, FileText, LineChart, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth, iuran } = usePage<any>().props;
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        const laporan: any = generateLaporan(iuran);
        setDatas(laporan);
    }, []);

    const fiturList = [
        { icon: <BarChart2 className="h-6 w-6 text-indigo-600" />, label: 'Rekap Keuangan Bulanan', link: '' },
        { icon: <FileText className="h-6 w-6 text-green-600" />, label: 'Laporan Per Kabupaten', link: '' },
        { icon: <UploadCloud className="h-6 w-6 text-yellow-600" />, label: 'Upload Bukti Pembayaran', link: '' },
        { icon: <LineChart className="h-6 w-6 text-pink-600" />, label: 'Analisis Otomatis', link: '' },
    ];

    return (
        <>
            <Head title="Beranda" />

            <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-800 dark:from-[#0e0e0e] dark:via-[#0e0e0e] dark:to-[#0e0e0e] dark:text-white">
                {/* NAVIGATION */}
                <header className="mx-auto flex max-w-7xl items-center justify-between p-6">
                    <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">PGRI Iuran</h1>
                    <nav className="space-x-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-indigo-600 hover:underline">
                                    Masuk
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* HERO SECTION */}
                <section className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-8 px-6 py-12 lg:flex-row">
                    <div className="max-w-xl">
                        <h2 className="mb-4 text-4xl leading-tight font-extrabold text-gray-900 dark:text-white">Sistem Rekap Iuran Digital</h2>
                        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                            Menyajikan laporan keuangan yang transparan, cepat, dan akurat untuk seluruh organisasi daerah.
                        </p>
                        {/* <Link href="" className="inline-block rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
                            Lihat Rekap Iuran
                        </Link> */}
                    </div>
                    <img src="/pgri1.png" alt="PGRI Logo" className="h-64 w-64 object-contain" />
                </section>

                {/* FITUR SECTION */}
                <section className="mx-auto max-w-7xl px-6 py-12">
                    <h3 className="mb-8 text-center text-3xl font-semibold">Fitur Utama</h3>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {fiturList.map((fitur, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow transition hover:bg-indigo-50 hover:shadow-md dark:bg-[#1e1e1e] dark:hover:bg-[#2a2a2a]"
                            >
                                {fitur.icon}
                                <p className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-200">{fitur.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="mt-20 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    © 2025 PGRI Riau • Sistem Rekap Iuran Digital
                </footer>
            </div>
        </>
    );
}
