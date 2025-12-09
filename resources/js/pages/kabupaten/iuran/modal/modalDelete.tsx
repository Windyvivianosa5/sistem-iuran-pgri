import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ModalDelete({ iuran, open, setOpen }: { iuran: any; open: boolean; setOpen: (open: boolean) => void }) {
    const [onDelete, setOnDelete] = useState(false);
    const handleDelete = (id: number) => {
        router.delete(`/kabupaten/dashboard/iuran/${id}`, {
            onProgress: () => {
                setOnDelete(true);
            },
            onSuccess: () => {
                toast.success('Data berhasil dihapus');
                setOpen(false);
                setOnDelete(false);
            },
        });
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>Open</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yakin ingin menghapus?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(!open)} variant="secondary">
                        Batalkan
                    </Button>
                    <Button
                        type="submit"
                        variant={'destructive'}
                        onClick={() => {
                            setOnDelete(true);
                            handleDelete(iuran.id);
                        }}
                        disabled={onDelete}
                    >
                        {onDelete ? 'loading...' : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
