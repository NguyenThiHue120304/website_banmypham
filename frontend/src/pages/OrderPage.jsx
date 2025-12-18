import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaMapMarkerAlt, FaMoneyBillWave, FaTrash, FaTruck, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
    const { id: orderId } = useParams();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get(`/api/orders/${orderId}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrder();
        } else {
            navigate('/login');
        }
    }, [orderId, userInfo, navigate]);

    const cancelOrderHandler = async () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };

                await axios.delete(`/api/orders/${orderId}`, config);
                toast.success("Đã hủy đơn hàng thành công!");
                navigate('/profile');

            } catch (err) {
                toast.error(err.response?.data?.message || "Lỗi khi hủy đơn hàng");
            }
        }
    };

    const getImgUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150?text=No+Image";
        if (path.startsWith("http")) return path;
        let cleanPath = path.replace(/\\/g, "/");
        if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
        return cleanPath;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa cập nhật";
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return "Lỗi ngày"; }
    };

    if (loading) return <div className="p-20 text-center text-xl font-bold text-gray-500">Đang tải đơn hàng...</div>;
    if (error) return <div className="p-20 text-center text-red-500 font-bold text-xl">Lỗi: {error}</div>;
    if (!order) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase truncate">
                        Đơn hàng <span className="text-pink-600">#{order._id}</span>
                    </h1>
                    <Link to="/profile" className="text-gray-500 hover:text-pink-600 font-semibold underline flex-shrink-0">
                        &larr; Quay lại lịch sử
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-pink-500">
                            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800 border-b pb-2">
                                <FaUser className="mr-2 text-pink-600" /> Thông tin nhận hàng
                            </h2>
                            <div className="text-gray-600 space-y-2">
                                <p>
                                    <strong className="text-gray-800">Người nhận:</strong>{" "}
                                    {order.shippingAddress?.fullName || order.user?.name}
                                </p>
                                <p><strong className="text-gray-800">Email:</strong> {order.user?.email}</p>
                                <p><strong className="text-gray-800">SĐT:</strong> {order.shippingAddress?.phone}</p>
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="mt-1 mr-2 text-pink-500 flex-shrink-0" />
                                    <span>
                                        {order.shippingAddress?.address}
                                        {order.shippingAddress?.ward ? `, ${order.shippingAddress.ward}` : ""}
                                        {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ""}
                                    </span>
                                </div>

                                <div className="mt-4 p-3 bg-gray-100 rounded flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-bold text-gray-700 flex items-center">
                                        <FaTruck className="mr-2" /> Trạng thái:
                                    </span>
                                    {order.isDelivered ? (
                                        <span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">
                                            Đã xác nhận ({formatDate(order.deliveredAt)})
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600 font-bold bg-yellow-100 px-3 py-1 rounded-full text-sm">
                                            Đang xử lý
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800 border-b pb-2">
                                <FaBoxOpen className="mr-2 text-pink-600" /> Sản phẩm
                            </h2>
                            <div className="divide-y">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-4">
                                        <div className="flex items-center flex-1">
                                            <div className="w-16 h-16 border rounded overflow-hidden flex-shrink-0 bg-gray-100">
                                                <img
                                                    src={getImgUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <Link to={`/product/${item.product}`} className="text-gray-800 font-semibold hover:text-pink-600 line-clamp-2">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-500 mt-1">{item.qty} x {item.price.toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-gray-800 ml-4">
                                            {(item.qty * item.price).toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow sticky top-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800 border-b pb-2">
                                <FaMoneyBillWave className="mr-2 text-pink-600" /> Thanh toán
                            </h2>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Phương thức:</p>
                                <p className="font-bold text-gray-800">{order.paymentMethod}</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-1">Trạng thái:</p>
                                {order.isPaid ? (
                                    <div className="w-full text-center bg-green-100 text-green-700 font-bold py-2 rounded">
                                        Đã thanh toán
                                        <div className="text-xs font-normal mt-1">{formatDate(order.paidAt)}</div>
                                    </div>
                                ) : (
                                    <div className="w-full text-center bg-red-100 text-red-700 font-bold py-2 rounded">
                                        Chưa thanh toán
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between items-center pt-4 border-t mt-4">
                                    <span className="font-bold text-lg text-gray-800">Tổng cộng:</span>
                                    <span className="font-bold text-2xl text-pink-600">
                                        {(order.totalPrice || 0).toLocaleString()}đ
                                    </span>
                                </div>
                            </div>

                            {!order.isDelivered && (
                                <button
                                    onClick={cancelOrderHandler}
                                    className="w-full bg-white border-2 border-red-500 text-red-500 py-3 rounded mt-6 hover:bg-red-500 hover:text-white font-bold uppercase transition shadow-sm flex items-center justify-center"
                                >
                                    <FaTrash className="mr-2" /> Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderPage;