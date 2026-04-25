import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert('Password tidak cocok!');
        }
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/');
        } catch (error) {
            alert('Registrasi gagal. Email mungkin sudah terdaftar.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Daftar Akun Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input 
                        type="email" 
                        required 
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                    <input 
                        type="password" 
                        required 
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Konfirmasi Password</label>
                    <input 
                        type="password" 
                        required 
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.confirmPassword} 
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                    Daftar
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Sudah punya akun? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Masuk di sini</Link>
            </p>
        </div>
    );
};

export default Register;
