import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert('Login gagal. Periksa email dan password.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Masuk ke Akun</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input 
                        type="email" 
                        required 
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                    <input 
                        type="password" 
                        required 
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                    Masuk
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Belum punya akun? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Daftar Sekarang</Link>
            </p>
        </div>
    );
};

export default Login;
