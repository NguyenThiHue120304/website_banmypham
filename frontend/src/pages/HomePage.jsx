import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaChevronLeft, FaChevronRight, FaHeadset, FaShippingFast, FaShoppingCart, FaUndo } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import SearchBox from '../components/SearchBox';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { keyword } = useParams();
    const banners = [
        {
            id: 1,
            image: "https://dnsg.1cdn.vn/thumbs/900x600/2023/12/14/sunlee-2.jpg",
            title: "Vẻ Đẹp Tỏa Sáng Từ Bên Trong",
            subtitle: "Khám phá bộ sưu tập mỹ phẩm cao cấp chính hãng. Giúp bạn tự tin, rạng ngời mỗi ngày.",
            badge: "New Collection 2024"
        },
        {
            id: 2,
            image: "https://cdn.tgdd.vn/Files/2018/12/12/1137594/top-my-pham-han-quoc-tot-nhat-cac-nang-phai-biet-202305201603179309.jpg",
            title: "Siêu Sale Giữa Tháng",
            subtitle: "Giảm giá lên đến 50% cho các dòng son môi và kem dưỡng ẩm. Mua ngay kẻo lỡ!",
            badge: "Flash Sale -50%"
        },
        {
            id: 3,
            image: "https://cdn.tgdd.vn/Files/2018/12/12/1137594/top-my-pham-han-quoc-tot-nhat-cac-nang-phai-biet-202305201618029118.jpg",
            title: "Chăm Sóc Da Toàn Diện",
            subtitle: "Bộ sản phẩm skincare từ thiên nhiên, an toàn cho mọi loại da nhạy cảm nhất.",
            badge: "Best Seller"
        }
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(slideInterval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1);
    };
    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = keyword ? `/api/products?keyword=${keyword}` : '/api/products';
                const { data } = await axios.get(url);
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, [keyword]);

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

            <div className="relative bg-gray-900 h-[500px] overflow-hidden group">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <div className="absolute inset-0">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover opacity-60"
                            />
                        </div>

                        <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
                            <div className="w-full md:w-2/3 text-white space-y-6 animate-fade-in-up">
                                <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider inline-block mb-2">
                                    {banner.badge}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                    {banner.title}
                                </h1>
                                <p className="text-lg text-gray-200 md:pr-10 max-w-2xl">
                                    {banner.subtitle}
                                </p>
                                <div className="flex space-x-4 pt-4">
                                    <Link to="/search" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg flex items-center">
                                        Mua Ngay <FaArrowRight className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white text-white hover:text-gray-900 p-3 rounded-full transition opacity-0 group-hover:opacity-100 z-20">
                    <FaChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white text-white hover:text-gray-900 p-3 rounded-full transition opacity-0 group-hover:opacity-100 z-20">
                    <FaChevronRight size={20} />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-pink-600 w-8" : "bg-white/50 hover:bg-white"
                                }`}
                        />
                    ))}
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

            <div className="container mx-auto px-6 mb-10">
                <div className="max-w-xl mx-auto">
                    <SearchBox />
                </div>
            </div>

            <div className="container mx-auto px-6 pb-20">
                <div className="flex justify-between items-end mb-8 border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Sản phẩm</h2>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
                        <p className="text-gray-500">Đang tải sản phẩm siêu hot...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                <Link to={`/product/${product._id}`} className="block relative h-72 overflow-hidden bg-gray-50">
                                    <img
                                        src={getImgUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
                                        -20%
                                    </span>

                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-pink-600 hover:text-white text-sm whitespace-nowrap">
                                        Xem chi tiết
                                    </button>
                                </Link>

                                <div className="p-4">
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.brand}</p>
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="font-bold text-gray-800 mb-1 truncate group-hover:text-pink-600 transition">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-extrabold text-pink-600">{product.price?.toLocaleString()}đ</span>
                                            <span className="text-xs text-gray-400 line-through">{(product.price * 1.2).toLocaleString()}đ</span>
                                        </div>

                                        <button className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-pink-600 hover:text-white transition-colors duration-300 shadow-sm">
                                            <FaShoppingCart />
                                        </button>
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