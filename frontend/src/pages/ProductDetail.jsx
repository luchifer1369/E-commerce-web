import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const resProduct = await api.get(`/products/${id}`);
                setProduct(resProduct.data);

                const resReviews = await api.get(`/reviews/product/${id}`);
                setReviews(resReviews.data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
    if (!product) return <div className="text-center py-20 text-gray-500">Produk tidak ditemukan</div>;

    const handleAddToCart = () => {
        addToCart(product, quantity, product.umkm._id);
        alert('Produk ditambahkan ke keranjang!');
        navigate('/cart');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
                {/* Image Gallery Placeholder */}
                <div className="w-full md:w-1/2">
                    <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
                        {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <p className="text-2xl font-bold text-blue-600 mb-4">Rp {product.price.toLocaleString('id-ID')}</p>
                        
                        <div className="flex items-center gap-2 mb-4 text-yellow-500 font-semibold">
                            <Star size={18} className="fill-current"/> {product.averageRating} ({product.totalReviews} ulasan)
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-1">Deskripsi:</h3>
                            <p className="text-gray-600 text-sm">{product.description}</p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6">Sisa Stok: <span className="font-semibold text-gray-800">{product.stock}</span></p>
                    </div>

                    {/* Add to Cart Section */}
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center border rounded-lg">
                            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span className="px-4 font-semibold">{quantity}</span>
                            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            disabled={product.stock < 1}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            <ShoppingCart size={20} />
                            {product.stock < 1 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ulasan Produk</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">Belum ada ulasan untuk produk ini.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review._id} className="border-b pb-4 last:border-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-800">{review.buyer?.name || 'User'}</span>
                                    <div className="flex items-center text-yellow-500 text-sm">
                                        <Star size={14} className="fill-current"/> <span className="ml-1">{review.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
