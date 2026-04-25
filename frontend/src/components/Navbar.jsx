import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <Store size={24} />
                    UMKM Lokal
                </Link>
                <div className="flex gap-4">
                    {/* Placeholder untuk menu login/register yang akan dibuat di tahap 10 */}
                    <button className="text-gray-600 hover:text-blue-600">Login</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
