import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const OrderListPage = () => {
    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get("/api/orders", config);
            setOrders(data);
        } catch (error) {
            toast.error("Lỗi tải đơn hàng");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userInfo]);

    const deliverHandler = async (id) => {
        if (window.confirm("Xác nhận đơn hàng này đã xử lý xong?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`/api/orders/${id}/deliver`, {}, config);
                toast.success("Đã cập nhật trạng thái đơn hàng!");
                fetchOrders();
            } catch (error) {
                toast.error("Lỗi cập nhật: " + error.message);
            }
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 uppercase text-gray-800">Quản lý Đơn hàng</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-pink-600 text-white uppercase text-sm font-bold">
                        <tr>
                            <th className="p-4">Mã đơn</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Ngày đặt</th>
                            <th className="p-4">Tổng tiền</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition">
                                <td className="p-4 text-sm font-bold text-gray-600" title={order._id}>
                                    {index + 1}
                                </td>
                                <td className="p-4 font-semibold text-gray-800">{order.user && order.user.name}</td>
                                <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td className="p-4 font-bold text-red-500">{order.totalPrice.toLocaleString()} đ</td>

                                <td className="p-4">
                                    {order.isDelivered ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                            Đã xác nhận
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
                                            Đang chờ xử lý
                                        </span>
                                    )}
                                </td>

                                <td className="p-4">
                                    {!order.isDelivered && (
                                        <button
                                            onClick={() => deliverHandler(order._id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow transition"
                                        >
                                            Xác nhận
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default OrderListPage;