import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-10 pb-6 mt-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-pink-500">MỸ PHẨM SHOP</h3>
                    <p className="text-gray-400 text-sm">
                        Chuyên cung cấp mỹ phẩm chính hãng, giúp bạn tự tin tỏa sáng mỗi ngày.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">Liên kết</h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li><a href="#" className="hover:text-pink-500">Trang chủ</a></li>
                        <li><a href="#" className="hover:text-pink-500">Giới thiệu</a></li>
                        <li><a href="#" className="hover:text-pink-500">Liên hệ</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">Chính sách</h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li>Giao hàng & Thanh toán</li>
                        <li>Chính sách đổi trả</li>
                        <li>Bảo mật thông tin</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">Kết nối</h3>
                    <div className="flex space-x-4">
                        <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
                        <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
                        <FaTiktok className="text-2xl cursor-pointer hover:text-white" />
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500 text-xs mt-10 border-t border-gray-700 pt-4">
                © 2025 My Pham Shop. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;