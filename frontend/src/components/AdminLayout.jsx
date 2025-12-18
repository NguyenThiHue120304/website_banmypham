import { useEffect } from "react";
import { FaBox, FaClipboardList, FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6 text-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-pink-500">ADMIN MYPHAM</h2>
          <p className="text-xs text-gray-400 mt-1">Xin chào, {userInfo?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
            <FaHome className="mr-3 text-blue-400" /> Dashboard
          </Link>
          <Link to="/admin/productlist" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
            <FaBox className="mr-3 text-green-400" /> Quản lý Sản phẩm
          </Link>
          <Link to="/admin/userlist" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
            <FaUser className="mr-3 text-yellow-400" /> Quản lý Users
          </Link>
          <Link to="/admin/orderlist" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
            <FaClipboardList className="mr-3 text-pink-400" /> Quản lý Đơn hàng
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center w-full p-3 bg-red-600 hover:bg-red-700 rounded text-white transition font-bold">
            <FaSignOutAlt className="mr-3" /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg min-h-[85vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;