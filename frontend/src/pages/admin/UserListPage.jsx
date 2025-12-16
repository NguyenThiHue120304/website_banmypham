import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const UserListPage = () => {
    const { userInfo } = useAuth();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get("/api/users", config);
            setUsers(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách người dùng");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [userInfo]);

    const deleteHandler = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa người dùng này?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/users/${id}`, config);
                toast.success("Đã xóa người dùng");
                fetchUsers();
            } catch (error) {
                toast.error("Không thể xóa: " + error.response.data.message);
            }
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 uppercase text-gray-800">Quản lý Người dùng</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-gray-100 uppercase text-sm font-bold text-gray-600">
                        <tr>
                            <th className="p-4 border-b">STT</th>
                            <th className="p-4 border-b">Tên</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Số ĐT</th>
                            <th className="p-4 border-b">Địa chỉ</th>
                            <th className="p-4 border-b text-center">Admin</th>
                            <th className="p-4 border-b text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500 font-bold">
                                    {index + 1}
                                </td>

                                <td className="p-4 font-semibold text-gray-800">{user.name}</td>
                                <td className="p-4 text-blue-600 text-sm">{user.email}</td>

                                <td className="p-4 text-gray-700">
                                    {user.phone ? user.phone : <span className="text-gray-400 italic">Trống</span>}
                                </td>

                                <td className="p-4 text-sm text-gray-600 max-w-xs">
                                    {user.city ? (
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{user.address}</span>
                                            <span>{user.ward}, {user.city}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Chưa cập nhật</span>
                                    )}
                                </td>

                                <td className="p-4 text-center">
                                    {user.isAdmin ? (
                                        <FaCheck className="text-green-500 mx-auto" />
                                    ) : (
                                        <FaTimes className="text-red-300 mx-auto" />
                                    )}
                                </td>

                                <td className="p-4 text-center">
                                    {!user.isAdmin && (
                                        <button
                                            onClick={() => deleteHandler(user._id)}
                                            className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded hover:bg-red-200 transition"
                                            title="Xóa người dùng"
                                        >
                                            <FaTrash />
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
export default UserListPage;