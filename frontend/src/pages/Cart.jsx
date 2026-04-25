import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        try {
            const orderData = {
                umkmId: cart[0].umkm,
                items: cart.map(item => ({ product: item.product, quantity: item.quantity })),
                deliveryMethod,
                deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
                paymentMethod,
                notes: 'Pesanan dari web'
            };

            await api.post('/orders', orderData);
            alert('Pesanan berhasil dibuat!');
            clearCart();
            navigate('/buyer/orders');
        } catch (error) {
            console.error("Checkout failed", error);
            alert('Checkout gagal. Pastikan Anda sudah login sebagai buyer.');
        }
    };

    if (cart.length === 0) return <div className="text-center py-20 text-gray-500">Keranjang belanja Anda kosong.</div>;

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Keranjang Belanja</h1>
                {cart.map(item => (
                    <div key={item.product} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-blue-600">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                            <button onClick={() => removeFromCart(item.product)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full md:w-1/3">
                <form onSubmit={handleCheckout} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pengambilan</label>
                        <select className="w-full border rounded-lg p-2" value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)}>
                            <option value="pickup">Ambil di Toko (Pickup)</option>
                            <option value="delivery">Kirim ke Alamat (Delivery)</option>
                        </select>
                    </div>

                    {deliveryMethod === 'delivery' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengiriman</label>
                            <textarea required className="w-full border rounded-lg p-2" rows="3" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}></textarea>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                        <select className="w-full border rounded-lg p-2" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <option value="cod">Bayar di Tempat (COD)</option>
                            <option value="transfer">Transfer Bank</option>
                        </select>
                    </div>

                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        <span className="font-semibold text-gray-600">Total:</span>
                        <span className="text-xl font-bold text-blue-600">Rp {getCartTotal().toLocaleString('id-ID')}</span>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                        Checkout Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Cart;
