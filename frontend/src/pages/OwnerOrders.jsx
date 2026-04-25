import { useState, useEffect } from 'react';
import api from '../services/api';

const OwnerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/incoming');
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            alert(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Gagal update status");
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Kelola Pesanan Masuk</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">Belum ada pesanan masuk.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                    <p className="font-semibold text-gray-800">Pembeli: {order.buyer?.name || 'User'}</p>
                                </div>
                                <select 
                                    className="border rounded-lg p-2 text-sm bg-gray-50"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="done">Done</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
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
                                <div>
                                    <p className="text-xs text-gray-500">Metode: {order.deliveryMethod}</p>
                                    <p className="text-xs text-gray-500">Bayar: {order.paymentMethod}</p>
                                </div>
                                <span className="text-lg font-bold text-blue-600">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerOrders;
