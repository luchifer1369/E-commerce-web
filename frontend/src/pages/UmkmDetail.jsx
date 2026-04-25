import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import api from '../services/api';

const UmkmDetail = () => {
    const { id } = useParams();
    const [umkm, setUmkm] = useState(null);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' atau 'reviews'

    useEffect(() => {
        const fetchUmkmDetail = async () => {
            try {
                const resUmkm = await api.get(`/umkm/${id}`);
                setUmkm(resUmkm.data);
                
                const resProducts = await api.get(`/umkm/${id}/products`);
                setProducts(resProducts.data);
            } catch (error) {
                console.error("Error fetching details", error);
            }
        };
        fetchUmkmDetail();
    }, [id]);

    if (!umkm) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header UMKM */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="h-48 bg-blue-100 w-full relative">
                    {/* Placeholder untuk cover image jika ada */}
                </div>
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{umkm.name}</h1>
                            <p className="text-gray-600 mb-4">{umkm.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2"><MapPin size={16}/> {umkm.address}</div>
                                <div className="flex items-center gap-2"><Clock size={16}/> {umkm.openHours || 'Tidak ada info jam'}</div>
                                <div className="flex items-center gap-2"><Phone size={16}/> {umkm.phone}</div>
                                <div className="flex items-center gap-2 text-yellow-500 font-semibold">
                                    <Star size={16} className="fill-current"/> {umkm.averageRating} ({umkm.totalReviews} ulasan)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigasi */}
            <div className="flex gap-4 border-b">
                <button 
                    className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Produk
                </button>
                <button 
                    className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Ulasan
                </button>
            </div>

            {/* Konten Tab */}
            {activeTab === 'products' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <p className="col-span-full text-center py-10 text-gray-500">Belum ada produk.</p>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gray-200">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                                    <p className="text-blue-600 font-bold mb-2">Rp {product.price.toLocaleString('id-ID')}</p>
                                    <div className="text-xs text-gray-500">Stok: {product.stock}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center py-10">
                    <p className="text-gray-500">Fitur review produk detail akan diimplementasikan pada tahap selanjutnya.</p>
                </div>
            )}
        </div>
    );
};

export default UmkmDetail;
