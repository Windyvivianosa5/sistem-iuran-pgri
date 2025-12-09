'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard Kabupaten', href: '/kabupaten/dashboard/iuran' },
  { title: 'Detail Transaksi', href: '#' },
];

export default function Show({ iuran, transaction, ziggy }: { iuran: any; transaction?: any; ziggy: any }) {
  const formatRupiah = (val: number) =>
    `Rp ${Number(val).toLocaleString('id-ID')}`;

  const formatTanggal = (tanggal: string) =>
    new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'diterima':
        return <Badge variant="default" className="bg-green-600">✓ Diterima</Badge>;
      case 'rejected':
      case 'ditolak':
        return <Badge variant="destructive">✗ Ditolak</Badge>;
      default:
        return <Badge variant="outline">⏳ Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { icon: any; color: string; text: string }> = {
      settlement: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300', text: 'Berhasil' },
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: 'Pending' },
      cancel: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', text: 'Dibatalkan' },
      deny: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', text: 'Ditolak' },
      expire: { icon: XCircle, color: 'bg-gray-100 text-gray-800 border-gray-300', text: 'Kadaluarsa' },
      failure: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', text: 'Gagal' },
    };
    
    const badge = badges[status] || { icon: Clock, color: 'bg-gray-100 text-gray-800 border-gray-300', text: status };
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${badge.color}`}>
        <Icon className="h-4 w-4" />
        {badge.text}
      </div>
    );
  };

  // Check if this is a Midtrans transaction or manual upload
  const isMidtransTransaction = transaction && transaction.order_id;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Transaksi" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">
            {isMidtransTransaction ? '💳 Detail Transaksi Midtrans' : '📄 Detail Iuran'}
          </h1>
        </div>

        <Card className="w-full max-w-2xl border bg-white shadow">
          <CardContent className="space-y-4 p-6 text-sm text-gray-700">
            {isMidtransTransaction ? (
              <>
                {/* Midtrans Transaction Info */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-blue-900">ℹ️ Informasi Pembayaran</h3>
                  <p className="text-sm text-blue-800">Pembayaran dilakukan melalui Midtrans Payment Gateway</p>
                </div>

                <div>
                  <span className="font-medium text-gray-600">🆔 Order ID:</span>{' '}
                  <span className="font-mono text-xs text-black">{transaction.order_id}</span>
                </div>

                {transaction.transaction_id && (
                  <div>
                    <span className="font-medium text-gray-600">🔖 Transaction ID:</span>{' '}
                    <span className="font-mono text-xs text-black">{transaction.transaction_id}</span>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-600">💰 Jumlah:</span>{' '}
                  <span className="text-lg font-semibold text-black">{formatRupiah(transaction.gross_amount)}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">📝 Deskripsi:</span>{' '}
                  <span className="text-black">{transaction.description}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">💳 Status Pembayaran:</span>{' '}
                  {getPaymentStatusBadge(transaction.status)}
                </div>

                {transaction.payment_type && (
                  <div>
                    <span className="font-medium text-gray-600">🏦 Metode Pembayaran:</span>{' '}
                    <span className="capitalize text-black">{transaction.payment_type.replace('_', ' ')}</span>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-600">📅 Tanggal Transaksi:</span>{' '}
                  <span className="text-black">{formatTanggal(transaction.created_at)}</span>
                </div>

                {transaction.settlement_time && (
                  <div>
                    <span className="font-medium text-gray-600">✅ Waktu Settlement:</span>{' '}
                    <span className="text-black">{formatTanggal(transaction.settlement_time)}</span>
                  </div>
                )}

                {transaction.status === 'settlement' && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Pembayaran Berhasil!</h3>
                        <p className="text-sm text-green-700">Transaksi telah berhasil diproses dan dikonfirmasi.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Manual Upload Info (Legacy) */}
                <div>
                  <span className="font-medium text-gray-600">💰 Jumlah:</span>{' '}
                  <span className="font-semibold text-black">{formatRupiah(iuran.jumlah)}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">📅 Tanggal:</span>{' '}
                  <span className="text-black">{formatTanggal(iuran.tanggal)}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">📝 Keterangan:</span>{' '}
                  <span className="text-black">{iuran.deskripsi}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">✅ Status Verifikasi:</span>{' '}
                  {getVerificationBadge(iuran.terverifikasi)}
                </div>

                {iuran.bukti_transaksi && (
                  <div>
                    <span className="font-medium text-gray-600">📎 Bukti Transfer:</span>
                    <div className="mt-2">
                      <img
                        src={`${ziggy.url}/storage/${iuran.bukti_transaksi}`}
                        alt="Bukti Transfer"
                        className="w-full max-w-md rounded-lg border shadow-md"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div>
          <Link href="/kabupaten/dashboard/iuran">
            <Button variant="secondary">⬅ Kembali</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
