import { FaArrowLeft, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
    const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const getImgUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150";
        if (path.startsWith("http")) return path;
        if (path.startsWith("/uploads")) return `http://localhost:5000${path}`;
        return path;
    };
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition font-medium">
                    <FaArrowLeft className="mr-2" /> Tiếp tục mua sắm
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-center text-pink-700 mb-8 uppercase">Giỏ hàng của bạn</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                        alt="Empty Cart"
                        className="w-32 h-32 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-xl text-gray-500 mb-4">Giỏ hàng đang trống trơn à!</p>
                    <Link to="/" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 shadow-lg">
                        Quay lại mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">

                                <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                    <img
                                        src={getImgUrl(item.image)}
                                        alt={item.name}
                                        className="h-20 w-20 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                        <p className="text-pink-600 font-semibold">{item.price.toLocaleString()} đ</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => decreaseQty(item._id)}
                                            className="px-3 py-2 bg-gray-50 hover:bg-gray-200 text-gray-600 transition"
                                        >
                                            <FaMinus size={12} />
                                        </button>

                                        <span className="px-4 py-2 font-bold text-gray-700 min-w-[40px] text-center bg-white">
                                            {item.qty}
                                        </span>

                                        <button
                                            onClick={() => increaseQty(item._id)}
                                            className="px-3 py-2 bg-gray-50 hover:bg-gray-200 text-gray-600 transition"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-400 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-full transition"
                                        title="Xóa sản phẩm"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-pink-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Cộng giỏ hàng</h2>

                            <div className="flex justify-between mb-3 text-gray-600">
                                <span>Tạm tính:</span>
                                <span>{totalPrice.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between mb-3 text-gray-600">
                                <span>Phí vận chuyển:</span>
                                <span className="text-green-600">Miễn phí</span>
                            </div>

                            <div className="border-t my-4 pt-4 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-red-600">{totalPrice.toLocaleString()} đ</span>
                            </div>

                            <button
                                onClick={() => {
                                    window.location.href = '/shipping';
                                }}
                                className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 uppercase transition shadow-lg mt-2"
                            >
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;