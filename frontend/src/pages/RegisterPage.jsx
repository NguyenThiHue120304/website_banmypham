import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    
    const result = await register(name, email, password);
    
    if (result.success) {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      
      navigate("/login"); 
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Đăng Ký</h2>
        
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Họ tên</label>
            <input type="text" placeholder="Nguyễn Văn A" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" placeholder="email@example.com" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
            <input type="password" placeholder="******" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nhập lại mật khẩu</label>
            <input type="password" placeholder="******" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition shadow-md">
            Đăng Ký
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Đã có tài khoản? <Link to="/login" className="text-pink-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;