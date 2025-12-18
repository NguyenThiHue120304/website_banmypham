import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaShoppingCart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                toast.error("Không tìm thấy sản phẩm");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const getImgUrl = (path) => {
        if (!path) return "https://via.placeholder.com/300";
        
        if (path.startsWith("http")) return path;
        
        if (path.startsWith("/uploads")) return `http://localhost:5000${path}`;
        
        return path;
    };

    const addToCartHandler = () => {
        addToCart(product, qty);
        toast.success("Đã thêm vào giỏ hàng!");
        navigate("/cart");
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;
    if (!product) return <div className="text-center py-20">Sản phẩm không tồn tại</div>;

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <Link to="/" className="flex items-center text-gray-600 hover:text-pink-600 mb-6 font-medium w-fit">
                <FaArrowLeft className="mr-2" /> Quay lại trang chủ
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    
                    <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <img
                            src={getImgUrl(product.image)}
                            alt={product.name}
                            className="max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300?text=Lỗi+Ảnh";
                            }}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-pink-600 font-bold uppercase tracking-wide mb-2">
                                {product.brand} - {product.category}
                            </p>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                            
                            <div className="flex items-center text-yellow-400 text-sm mb-4">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                                <span className="text-gray-400 ml-2">(0 đánh giá)</span>
                            </div>

                            <div className="text-gray-600 italic border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded">
                                {product.description}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-pink-600">
                                {product.price?.toLocaleString()} ₫
                            </span>
                            {product.countInStock > 0 ? (
                                <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                    Còn hàng
                                </span>
                            ) : (
                                <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
                                    Hết hàng
                                </span>
                            )}
                        </div>

                        {product.countInStock > 0 && (
                            <div className="flex items-center space-x-4 pt-4 border-t">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button 
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-bold"
                                    >-</button>
                                    <span className="px-4 py-2 font-bold text-gray-800">{qty}</span>
                                    <button 
                                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                        className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-bold"
                                    >+</button>
                                </div>

                                <button
                                    onClick={addToCartHandler}
                                    className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-pink-700 flex items-center justify-center gap-2 transition transform active:scale-95"
                                >
                                    <FaShoppingCart /> Thêm vào giỏ
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-8 border-t">
                    <h3 className="font-bold text-gray-800 mb-2">Thông tin thêm</h3>
                    <p className="text-gray-600 text-sm">
                        Sản phẩm chính hãng 100%. Bảo hành đổi trả trong vòng 7 ngày nếu có lỗi từ nhà sản xuất. Giao hàng toàn quốc.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;