import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    toast.success(`Đã thêm ${qty} ${product.name} vào giỏ!`);
  };

  if (!product) return <div className="text-center py-20">Đang tải chi tiết...</div>;

  return (
    <div className="container mx-auto p-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-pink-600 mb-6 font-medium">
        <FaArrowLeft className="mr-2" /> Quay lại trang chủ
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[500px] bg-gray-100 flex items-center justify-center p-8">
            <img src={product.image} alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition duration-500" />
          </div>

          <div className="p-10 flex flex-col justify-center">
            <span className="text-pink-500 font-bold tracking-wide text-sm uppercase mb-2">{product.brand} - {product.category}</span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 text-lg">
                {'★'.repeat(Math.round(product.rating))}
                <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
              </div>
              <span className="text-gray-500 ml-3 text-sm">({product.numReviews} đánh giá)</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center mb-8">
              <span className="text-4xl font-bold text-red-500">{product.price.toLocaleString()} đ</span>
              {product.countInStock > 0 ? (
                <span className="ml-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Còn hàng</span>
              ) : (
                <span className="ml-4 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-100 text-xl">-</button>
                  <span className="px-4 font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))} className="px-4 py-3 hover:bg-gray-100 text-xl">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center transition transform active:scale-95"
                >
                  <FaShoppingCart className="mr-3" /> Thêm vào giỏ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 p-8 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Thông tin thêm</h3>
        <p className="text-gray-600">Sản phẩm chính hãng 100%. Bảo hành đổi trả trong vòng 7 ngày nếu có lỗi từ nhà sản xuất. Giao hàng toàn quốc.</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;