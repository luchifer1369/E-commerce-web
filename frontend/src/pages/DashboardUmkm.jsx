import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Settings, ClipboardList } from 'lucide-react';

const DashboardUmkm = () => {
    const [products, setProducts] = useState([]);
    
    // Placeholder logic for products
    useEffect(() => {
        const fetchMyProducts = async () => {
            // Kita butuh ID UMKM owner ini. Di Tahap 10 ini fokus pada kerangka dashboard.
            // Untuk sekarang kita tampilkan statistik kosong atau petunjuk.
        };
        fetchMyProducts();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Toko Saya</h1>
                    <p className="text-sm text-gray-500">Kelola produk dan pesanan toko Anda di sini.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Link to="/owner/orders" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <ClipboardList size={18} /> Pesanan
                    </Link>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        <PlusCircle size={18} /> Tambah Produk
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Total Produk</p>
                            <p className="text-xl font-bold text-gray-800">--</p>
                        </div>
                    </div>
                </div>
                {/* Info Card Lainnya */}
            </div>

            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="max-w-md mx-auto">
                    <Settings size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Manajemen Produk & Foto</h3>
                    <p className="text-gray-500 text-sm mb-6">Fitur upload foto produk via Cloudinary sedang dalam tahap finalisasi integrasi UI.</p>
                    <button className="text-blue-600 font-semibold hover:underline">Pelajari cara mengelola toko</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardUmkm;
