import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ShippingPage = () => {
    const { cartItems, clearCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [specificAddress, setSpecificAddress] = useState("");

    const [locations, setLocations] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    useEffect(() => {
        if (userInfo) {
            setFullName(userInfo.name || "");
            setPhone(userInfo.phone || "");
            setSelectedCity(userInfo.city || "");
            setSelectedWard(userInfo.ward || "");
            setSpecificAddress(userInfo.address || "");
        }
    }, [userInfo]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/data/locations.csv');
                const text = await response.text();

                const lines = text.split('\n');
                const data = lines.map(line => {
                    const parts = line.split(',');
                    if (parts.length >= 6) {
                        return {
                            city: parts[5]?.trim(),
                            ward: parts[1]?.trim()
                        };
                    }
                    return null;
                }).filter(item => item && item.city && item.ward);

                setLocations(data);

                const uniqueProvinces = [...new Set(data.map(item => item.city))]
                    .sort((a, b) => a.localeCompare(b, 'vi'));

                setProvinces(uniqueProvinces);

            } catch (error) {
                console.error("Lỗi đọc file location:", error);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedCity && locations.length > 0) {
            const wardList = locations
                .filter(item => item.city === selectedCity)
                .map(item => item.ward)
                .sort((a, b) => a.localeCompare(b, 'vi'));

            const uniqueWards = [...new Set(wardList)];
            setWards(uniqueWards);

            if (!uniqueWards.includes(selectedWard)) {
                setSelectedWard("");
            }
        }
    }, [selectedCity, locations]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!selectedCity || !selectedWard || !specificAddress || !fullName || !phone) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        const formattedOrderItems = cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
        }));

        const orderData = {
            orderItems: formattedOrderItems,
            shippingAddress: {
                fullName: fullName,
                address: specificAddress,
                city: selectedCity,
                ward: selectedWard,
                phone: phone
            },
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

            if(clearCart) clearCart();
            localStorage.removeItem("cartItems");

            setTimeout(() => {
                navigate("/profile");
            }, 1500);

        } catch (error) {
            toast.error("Lỗi đặt hàng: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border-t-4 border-pink-600">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">
                    Thông tin giao hàng
                </h2>

                <form onSubmit={submitHandler} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Họ và tên người nhận</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                placeholder="Nguyễn Văn A..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                placeholder="09xxxxxxxxx" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Tỉnh / Thành phố</label>
                            <select 
                                required
                                className="w-full p-3 border rounded-lg focus:outline-pink-500 bg-white"
                                value={selectedCity} 
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                {provinces.map((prov, i) => (
                                    <option key={i} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Phường / Xã</label>
                            <select 
                                required
                                className="w-full p-3 border rounded-lg focus:outline-pink-500 bg-white"
                                value={selectedWard} 
                                onChange={(e) => setSelectedWard(e.target.value)}
                                disabled={!selectedCity}
                            >
                                <option value="">-- Chọn Phường/Xã --</option>
                                {wards.map((ward, i) => (
                                    <option key={i} value={ward}>{ward}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Địa chỉ chi tiết</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Số nhà, tên đường, tòa nhà..."
                            className="w-full p-3 border rounded-lg focus:outline-pink-500"
                            value={specificAddress} 
                            onChange={(e) => setSpecificAddress(e.target.value)} 
                        />
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <div className="flex justify-between items-center text-lg font-bold mb-6">
                            <span className="text-gray-700">Tổng thanh toán:</span>
                            <span className="text-pink-600 text-2xl">{totalPrice.toLocaleString()} đ</span>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-pink-600 text-white py-4 rounded-lg font-bold hover:bg-pink-700 shadow-lg uppercase transition-transform transform hover:-translate-y-1"
                        >
                            Xác nhận đặt hàng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;