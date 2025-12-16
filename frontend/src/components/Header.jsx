import { FaShoppingCart, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
    const { cartItems } = useCart();
    const { userInfo, logout } = useAuth();

    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="bg-pink-600 text-white shadow-lg py-4 px-8 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold uppercase tracking-wider hover:text-pink-200">
                    Mỹ Phẩm Shop
                </Link>

                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative flex items-center hover:text-pink-200 transition">
                        <FaShoppingCart size={24} />
                        {totalQty > 0 && (
                            <span className="absolute -top-2 -right-3 bg-yellow-400 text-pink-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                {totalQty}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="font-semibold flex items-center hover:text-pink-200 transition">
                                <FaUser className="mr-2" /> {userInfo.name}
                            </Link>

                            <button onClick={logout} className="text-sm bg-pink-700 hover:bg-pink-800 px-3 py-1 rounded flex items-center transition">
                                <FaSignOutAlt className="mr-1" /> Thoát
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center hover:text-pink-200 transition font-medium">
                            <FaUser size={20} className="mr-2" /> Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;