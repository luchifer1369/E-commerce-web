import { Link, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, ClipboardList, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <Store size={24} />
                    UMKM Lokal
                </Link>
                <div className="flex gap-6 items-center">
                    <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            <Link to="/buyer/orders" title="Pesanan Saya" className="text-gray-600 hover:text-blue-600">
                                <ClipboardList size={24} />
                            </Link>

                            {user.role === 'owner' ? (
                                <Link to="/owner/dashboard" title="Dashboard Toko" className="text-gray-600 hover:text-blue-600">
                                    <LayoutDashboard size={24} />
                                </Link>
                            ) : (
                                <Link to="/register-umkm" className="text-sm font-bold text-green-600 hover:text-green-700">
                                    Buka Toko
                                </Link>
                            )}

                            <div className="flex items-center gap-2 border-l pl-6">
                                <User size={20} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="ml-2 text-gray-400 hover:text-red-500 transition"
                                    title="Keluar"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Masuk
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
