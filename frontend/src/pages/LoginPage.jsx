import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSocialSuccess = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    toast.success("Đăng nhập thành công!");

    window.location.href = "/";
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axios.post("/api/users/google", {
          tokenId: tokenResponse.access_token
        });
        handleSocialSuccess(data);
      } catch (error) {
        toast.error("Lỗi đăng nhập Google");
      }
    },
    onError: () => toast.error("Đăng nhập Google thất bại"),
  });

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const { data } = await axios.post("/api/users/facebook", {
          accessToken: response.accessToken,
          userID: response.userID,
        });
        handleSocialSuccess(data);
      } catch (error) {
        toast.error("Lỗi đăng nhập Facebook");
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success("Đăng nhập thành công!");
      navigate(result.data?.isAdmin ? "/admin/dashboard" : "/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Đăng Nhập</h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" placeholder="Nhập email..." className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu..." className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition shadow-md uppercase">Đăng Nhập</button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => googleLoginHandler()}
              className="flex items-center justify-center w-full py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              <FaGoogle className="text-red-500 mr-2" /> Google
            </button>

            <FacebookLogin
              appId="1092541622871170"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              render={renderProps => (
                <button
                  onClick={renderProps.onClick}
                  className="flex items-center justify-center w-full py-2.5 border border-gray-300 rounded-lg shadow-sm bg-[#1877F2] text-white hover:bg-[#166fe5] transition font-medium"
                >
                  <FaFacebookF className="mr-2" /> Facebook
                </button>
              )}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Chưa có tài khoản? <Link to="/register" className="text-pink-600 font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;