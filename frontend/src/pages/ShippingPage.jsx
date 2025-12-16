import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ShippingPage = () => {
    const { cartItems, clearCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const submitHandler = async (e) => {
        e.preventDefault();

        const formattedOrderItems = cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
        }));

        const orderData = {
            orderItems: formattedOrderItems,
            shippingAddress: { address, city, phone },
            paymentMethod: 'Thanh toán khi nhận hàng (COD)',
            totalPrice: totalPrice,
        };

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('/api/orders', orderData, config);

            toast.success("Đặt hàng thành công! Cảm ơn bạn.");

            localStorage.removeItem("cartItems");

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);

        } catch (error) {
            toast.error("Lỗi đặt hàng: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-pink-600 mb-6 uppercase">Thông tin giao hàng</h2>

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Địa chỉ nhận hàng</label>
                        <input type="text" required placeholder="Số nhà, tên đường..."
                            className="w-full p-3 border rounded-lg focus:outline-pink-500"
                            value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Thành phố / Tỉnh</label>
                        <input type="text" required placeholder="Hà Nội, Đà Nẵng..."
                            className="w-full p-3 border rounded-lg focus:outline-pink-500"
                            value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                        <input type="text" required placeholder="09xxxxxxxxx"
                            className="w-full p-3 border rounded-lg focus:outline-pink-500"
                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-lg font-bold mb-4">
                            <span>Tổng thanh toán:</span>
                            <span className="text-red-500">{totalPrice.toLocaleString()} đ</span>
                        </div>
                        <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 shadow-md uppercase">
                            Xác nhận đặt hàng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;