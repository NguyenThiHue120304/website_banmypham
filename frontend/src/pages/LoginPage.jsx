import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    console.log("Kết quả đăng nhập:", result);
    if (result.success) {
      toast.success("Đăng nhập thành công!");
      
      if (result.data && result.data.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Đăng Nhập</h2>
        
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition shadow-md">
            Đăng Nhập
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-pink-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;