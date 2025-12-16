import axios from "axios";
import { useEffect, useState } from "react";
import { FaClipboardList, FaInfoCircle, FaSave, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
    const { userInfo } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [specificAddress, setSpecificAddress] = useState("");
    const [locations, setLocations] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [myOrders, setMyOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setPhone(userInfo.phone || "");
            setSpecificAddress(userInfo.address || "");
            setSelectedCity(userInfo.city || "");
            setSelectedWard(userInfo.ward || "");
            fetchMyOrders();
        }
    }, [userInfo]);

    const fetchMyOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get("/api/orders/myorders", config);
            setMyOrders(data);
            setLoadingOrders(false);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
            setLoadingOrders(false);
        }
    };

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
        if (password && password !== confirmPassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const updateData = {
                name,
                password: password || undefined,
                phone,
                address: specificAddress,
                city: selectedCity,
                ward: selectedWard
            };
            const { data } = await axios.put("/api/users/profile", updateData, config);
            localStorage.setItem("userInfo", JSON.stringify(data));
            toast.success("Cập nhật hồ sơ thành công!");
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center mb-6">
                        <div className="w-24 h-24 mx-auto mb-3 bg-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                            <FaUser className="text-4xl text-pink-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{userInfo?.name}</h2>
                        <p className="text-gray-500 text-sm mb-2">{userInfo?.email}</p>
                        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            {userInfo?.isAdmin ? "Admin" : "Thành viên"}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center p-4 transition ${activeTab === 'profile' ? 'bg-pink-50 text-pink-600 font-bold border-l-4 border-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FaUser className="mr-3" /> Thông tin tài khoản
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center p-4 transition ${activeTab === 'orders' ? 'bg-pink-50 text-pink-600 font-bold border-l-4 border-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FaClipboardList className="mr-3" /> Lịch sử đơn hàng
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3">

                    {activeTab === 'profile' && (
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center">
                                <FaUser className="mr-3 text-pink-600" /> Cập nhật hồ sơ
                            </h2>
                            <form onSubmit={submitHandler} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
                                        <input type="text" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                                        <input type="text" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                            value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx..." />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input type="email" disabled className="w-full p-3 border bg-gray-100 rounded-lg text-gray-500"
                                        value={userInfo?.email} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Tỉnh / Thành phố</label>
                                        <select className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                            value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {provinces.map((prov, i) => <option key={i} value={prov}>{prov}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Phường / Xã</label>
                                        <select className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                            value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedCity}>
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {wards.map((ward, i) => <option key={i} value={ward}>{ward}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Địa chỉ chi tiết</label>
                                    <input type="text" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                        value={specificAddress} onChange={(e) => setSpecificAddress(e.target.value)}
                                        placeholder="Số nhà, đường..." />
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-md font-semibold text-gray-600 mb-3">Đổi mật khẩu (Tùy chọn)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <input type="password" placeholder="Mật khẩu mới" className="w-full p-3 border rounded-lg"
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <input type="password" placeholder="Nhập lại mật khẩu" className="w-full p-3 border rounded-lg"
                                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                </div>

                                <button type="submit" className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 shadow flex items-center">
                                    <FaSave className="mr-2" /> Lưu thay đổi
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center">
                                <FaClipboardList className="mr-3 text-pink-600" /> Lịch sử mua hàng
                            </h2>
                            {loadingOrders ? (
                                <p>Đang tải đơn hàng...</p>
                            ) : myOrders.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <FaClipboardList className="mx-auto text-5xl mb-3 text-gray-300" />
                                    <p>Bạn chưa có đơn hàng nào.</p>
                                    <Link to="/" className="text-pink-600 font-bold hover:underline mt-2 inline-block">Mua sắm ngay</Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-bold">
                                            <tr>
                                                <th className="p-4 border-b">STT</th>
                                                <th className="p-4 border-b">Ngày đặt</th>
                                                <th className="p-4 border-b">Tổng tiền</th>
                                                <th className="p-4 border-b">Trạng thái</th>
                                                <th className="p-4 border-b">Chi tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myOrders.map((order, index) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-4 font-bold text-gray-500">{index + 1}</td>
                                                    <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                                    <td className="p-4 font-bold text-pink-600">{order.totalPrice.toLocaleString()} đ</td>
                                                    <td className="p-4">
                                                        {order.isDelivered ? (
                                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Đã xác nhận</span>
                                                        ) : (
                                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Đang xử lý</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <Link to={`/order/${order._id}`} className="text-blue-500 hover:text-blue-700 flex items-center justify-center text-sm font-bold">
                                                            <FaInfoCircle className="mr-1" /> Xem chi tiết
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;