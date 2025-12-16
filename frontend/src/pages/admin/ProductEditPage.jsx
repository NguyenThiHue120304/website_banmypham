import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
            } catch (error) {
                toast.error("Lỗi tải sản phẩm");
            }
        };
        fetchProduct();
    }, [productId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/products/${productId}`,
                {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                },
                config
            );

            toast.success("Cập nhật sản phẩm thành công!");
            navigate("/admin/productlist");
        } catch (error) {
            toast.error("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto p-8">
            <Link to="/admin/productlist" className="flex items-center text-gray-600 hover:text-pink-600 mb-6 font-bold">
                <FaArrowLeft className="mr-2" /> Quay lại danh sách
            </Link>

            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto border-t-4 border-pink-600">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center uppercase">Chỉnh sửa sản phẩm</h1>
                
                <form onSubmit={submitHandler} className="space-y-5">
                    
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Tên sản phẩm</label>
                        <input type="text" className="w-full p-3 border rounded focus:outline-pink-500"
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Giá (VNĐ)</label>
                            <input type="number" className="w-full p-3 border rounded focus:outline-pink-500"
                                value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Số lượng kho</label>
                            <input type="number" className="w-full p-3 border rounded focus:outline-pink-500"
                                value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Thương hiệu</label>
                            <input type="text" className="w-full p-3 border rounded focus:outline-pink-500"
                                value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Danh mục</label>
                            <input type="text" className="w-full p-3 border rounded focus:outline-pink-500"
                                value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Link Ảnh sản phẩm</label>
                        <input type="text" className="w-full p-3 border rounded focus:outline-pink-500"
                            value={image} onChange={(e) => setImage(e.target.value)} 
                            placeholder="Nhập đường dẫn ảnh (URL)..." />
                        {image && <img src={image} alt="Preview" className="h-20 mt-2 object-cover border rounded"/>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Mô tả</label>
                        <textarea className="w-full p-3 border rounded focus:outline-pink-500 h-32"
                            value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded hover:bg-pink-700 transition flex justify-center items-center shadow-md">
                        <FaSave className="mr-2"/> Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;