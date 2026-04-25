import { Link } from 'react-router-dom';
import { Store, ShoppingCart, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cart } = useCart();

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
                    <Link to="/buyer/orders" className="text-gray-600 hover:text-blue-600">
                        <ClipboardList size={24} />
                    </Link>
                    {/* Placeholder untuk menu login/register yang akan dibuat di tahap 10 */}
                    <button className="text-gray-600 hover:text-blue-600 font-semibold">Login</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
