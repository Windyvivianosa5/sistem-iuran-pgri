export const formatNumber = (value: any) => {
    if (!value || value === '') return '';
    // Hapus semua karakter non-digit
    const numericValue = value.toString().replace(/\D/g, '');
    // Format dengan pemisah ribuan
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseNumber = (value: any) => {
    if (!value || value === '') return 0;
    // Hapus semua titik dan konversi ke number
    return parseInt(value.toString().replace(/\./g, '')) || 0;
};
