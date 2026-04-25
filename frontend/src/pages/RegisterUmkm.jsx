import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterUmkm = () => {
    const [formData, setFormData] = useState({ name: '', description: '', address: '', phone: '' });
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [latLng, setLatLng] = useState({ lat: -6.2, lng: 106.8 });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/umkm', {
                ...formData,
                location: { type: 'Point', coordinates: [latLng.lng, latLng.lat] }
            });
            alert('UMKM Berhasil didaftarkan!');
            const userRes = await api.get('/auth/me');
            setUser(userRes.data.data);
            navigate('/owner/dashboard');
        } catch (error) {
            console.error(error);
            alert('Gagal mendaftarkan UMKM');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Buka Toko UMKM Baru</h2>
            <p className="text-gray-500 text-center mb-8">Lengkapi data di bawah untuk mulai berjualan produk lokal Anda.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Nama Toko</label>
                    <input type="text" required className="w-full border p-2 rounded-lg" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi Singkat</label>
                    <textarea required className="w-full border p-2 rounded-lg" rows="3" onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Alamat Lengkap</label>
                    <textarea required className="w-full border p-2 rounded-lg" rows="2" onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">No Telepon/WA</label>
                    <input type="text" required className="w-full border p-2 rounded-lg" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
                    * Lokasi toko akan diambil secara otomatis menggunakan GPS perangkat Anda.
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">
                    Daftarkan Sekarang
                </button>
            </form>
        </div>
    );
};

export default RegisterUmkm;
