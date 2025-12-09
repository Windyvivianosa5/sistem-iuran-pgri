'use client';

import { DatePicker } from '@/components/datepicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { formatToMySQLDatetime } from '@/utils/formatdate';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard Kabupaten', href: '/kabupaten/dashboard/iuran/add' },
  { title: 'Edit Iuran', href: '#' },
];

type DataForm = {
  id: number;
  jumlah: number | undefined;
  tanggal: Date | undefined;
  bukti: File | undefined;
  keterangan: string;
};

export default function Update({ kabupaten, ziggy }: { kabupaten: any; ziggy: any }) {
  const { data, setData, post, processing, errors } = useForm<Required<DataForm | any>>({
    jumlah: parseFloat(kabupaten.jumlah).toString() || '',
    tanggal: kabupaten.tanggal || undefined,
    bukti_keterangan: kabupaten.bukti_transaksi || undefined,
    deskripsi: kabupaten.deskripsi || '',
    _method: 'put',
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('iuran.update', kabupaten.id), {
      forceFormData: true,
      onSuccess: () => toast.success('Data berhasil diupdate'),
      onError: (errors) => console.log(errors),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('bukti', file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Iuran" />
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-semibold text-gray-800">✏️ Edit Data Iuran</h1>

        <Card className="max-w-3xl w-full">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="jumlah">Jumlah</Label>
                <Input
                  type="number"
                  id="jumlah"
                  placeholder="Rp"
                  value={data.jumlah ?? ''}
                  onChange={(e) => setData('jumlah', parseInt(e.target.value || '0'))}
                />
                {errors.jumlah && <p className="text-red-500 text-xs">{errors.jumlah}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tanggal">Tanggal</Label>
                <DatePicker
                  date={data.tanggal}
                  setDate={(date) => setData('tanggal', formatToMySQLDatetime(date))}
                />
                {errors.tanggal && <p className="text-red-500 text-xs">{errors.tanggal}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bukti">Bukti Transfer</Label>
                {preview ? (
                  <img src={preview} className="w-full max-w-sm rounded-md border shadow" alt="Preview Bukti" />
                ) : (
                  <img
                    src={`${ziggy.url}/storage/${kabupaten.bukti_transaksi}`}
                    className="w-full max-w-sm rounded-md border shadow"
                    alt="Bukti Transfer"
                  />
                )}
                <Input type="file" id="bukti" onChange={handleFileChange} />
                {errors.bukti && <p className="text-red-500 text-xs">{errors.bukti}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  placeholder="Tulis keterangan tambahan (opsional)"
                  value={data.deskripsi}
                  onChange={(e) => setData('deskripsi', e.target.value)}
                />
                {errors.deskripsi && <p className="text-red-500 text-xs">{errors.deskripsi}</p>}
              </div>

              <div className="flex justify-between pt-4">
                <Link href="/kabupaten/dashboard/iuran">
                  <Button type="button" variant="secondary">
                    ← Kembali
                  </Button>
                </Link>

                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                  {processing ? 'Loading...' : 'Update Iuran'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
