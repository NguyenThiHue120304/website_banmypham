import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaHeadset, FaHeart, FaShippingFast, FaShoppingCart, FaStar, FaUndo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: "Son Môi", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=200&auto=format&fit=crop", color: "bg-red-100" },
        { name: "Chăm Sóc Da", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=200&auto=format&fit=crop", color: "bg-green-100" },
        { name: "Trang Điểm", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=200&auto=format&fit=crop", color: "bg-pink-100" },
        { name: "Nước Hoa", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200&auto=format&fit=crop", color: "bg-purple-100" },
        { name: "Quà Tặng", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop", color: "bg-yellow-100" },
        { name: "Khác", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=200&auto=format&fit=crop", color: "bg-gray-100" },
    ];
    const getImgUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150";
        if (path.startsWith("http")) return path;
        if (path.startsWith("/uploads")) return `http://localhost:5000${path}`;
        return path;
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">

            <div className="relative bg-gray-900 h-[500px] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1920&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 text-white space-y-6 animate-fade-in-up">
                        <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                            New Collection 2024
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Vẻ Đẹp <span className="text-pink-400">Tỏa Sáng</span> <br /> Từ Bên Trong
                        </h1>
                        <p className="text-lg text-gray-200 md:pr-10">
                            Khám phá bộ sưu tập mỹ phẩm cao cấp chính hãng. Giúp bạn tự tin, rạng ngời mỗi ngày với mức giá tốt nhất.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/search" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg flex items-center">
                                Mua Ngay <FaArrowRight className="ml-2" />
                            </Link>
                            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-gray-900 transition">
                                Xem Khuyến Mãi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-xl shadow-lg">
                    {[
                        { icon: FaShippingFast, title: "Giao hàng siêu tốc", desc: "Nội thành trong 2h", color: "text-blue-500" },
                        { icon: FaCheckCircle, title: "100% Chính hãng", desc: "Hoàn tiền gấp đôi nếu giả", color: "text-green-500" },
                        { icon: FaHeadset, title: "Hỗ trợ 24/7", desc: "Tư vấn chuyên nghiệp", color: "text-purple-500" },
                        { icon: FaUndo, title: "Đổi trả dễ dàng", desc: "Trong vòng 7 ngày", color: "text-orange-500" }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-2 border-r last:border-0 border-gray-100">
                            <item.icon className={`text-4xl ${item.color}`} />
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase tracking-wide">
                    Danh mục nổi bật
                </h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {categories.map((cat, index) => (
                        <div key={index} className="group cursor-pointer flex flex-col items-center">
                            <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl group-hover:scale-110 transition duration-300 ${cat.color} flex items-center justify-center`}>
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="mt-3 font-semibold text-gray-700 group-hover:text-pink-600 transition">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 mb-16">
                <div className="rounded-2xl overflow-hidden shadow-xl relative h-64 flex items-center bg-gradient-to-r from-pink-500 to-purple-600">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="relative z-10 px-10 text-white w-full md:w-2/3">
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">Flash Sale</span>
                        <h2 className="text-4xl font-bold mb-4">Siêu Sale Giữa Tháng</h2>
                        <p className="text-lg mb-6 text-white/90">Giảm giá lên đến 50% cho các dòng son môi và kem dưỡng ẩm cao cấp.</p>
                        <button className="bg-white text-pink-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition">Khám phá ngay</button>
                    </div>
                    <img
                        src="https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-cosmetics-and-makeup-products-png-image_11499596.png"
                        alt="Promo"
                        className="absolute right-10 bottom-0 h-full object-contain hidden md:block drop-shadow-2xl"
                    />
                </div>
            </div>

            <div className="container mx-auto px-6 pb-20">
                <div className="flex justify-between items-end mb-8 border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Sản phẩm mới về</h2>
                    <Link to="/search" className="text-pink-600 font-semibold hover:underline flex items-center">
                        Xem tất cả <FaArrowRight className="ml-2 text-sm" />
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
                        <p className="text-gray-500">Đang tải sản phẩm siêu hot...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden group border border-gray-100 relative">

                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                    -20%
                                </div>

                                <button className="absolute top-3 right-3 bg-white p-2 rounded-full text-gray-400 hover:text-red-500 shadow opacity-0 group-hover:opacity-100 transition z-10">
                                    <FaHeart />
                                </button>

                                <Link to={`/product/${product._id}`} className="block relative h-64 overflow-hidden bg-gray-100">
                                    <img
                                        src={getImgUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
                                </Link>

                                <div className="p-5">
                                    <div className="flex items-center text-yellow-400 text-xs mb-2">
                                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar className="text-gray-300" />
                                        <span className="text-gray-400 ml-1">(4.0)</span>
                                    </div>

                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="text-gray-800 font-semibold text-lg mb-1 truncate hover:text-pink-600 transition">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-gray-500 mb-3">{product.brand || 'Thương hiệu'}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <span className="text-xl font-bold text-pink-600">{product.price.toLocaleString()}đ</span>
                                            <span className="text-sm text-gray-400 line-through ml-2">{(product.price * 1.2).toLocaleString()}đ</span>
                                        </div>
                                        <Link to={`/product/${product._id}`} className="bg-gray-100 text-pink-600 p-3 rounded-full hover:bg-pink-600 hover:text-white transition shadow-sm">
                                            <FaShoppingCart />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-pink-50 py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký nhận tin khuyến mãi</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập nhật những xu hướng làm đẹp mới nhất.</p>
                    <div className="max-w-md mx-auto flex">
                        <input type="email" placeholder="Nhập email của bạn..." className="flex-1 p-4 rounded-l-lg border-none focus:ring-2 focus:ring-pink-500 shadow-sm" />
                        <button className="bg-gray-900 text-white px-8 py-4 rounded-r-lg font-bold hover:bg-gray-800 transition">Đăng ký</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;