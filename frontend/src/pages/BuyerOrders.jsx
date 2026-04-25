import { useState, useEffect } from 'react';
import api from '../services/api';

const BuyerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan Saya</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">Belum ada pesanan.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                    <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.status === 'done' ? 'bg-green-100 text-green-600' : 
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="text-sm text-gray-600 flex justify-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>Rp {item.price.toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-semibold text-gray-700">Total Harga:</span>
                                <span className="text-lg font-bold text-blue-600">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuyerOrders;
