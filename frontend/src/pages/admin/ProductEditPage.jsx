import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const { userInfo } = useAuth();
    const navigate = useNavigate();

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
                toast.error(error.response?.data?.message || error.message);
            }
        };
        fetchProduct();
    }, [productId]);

    const getImgUrl = (imgPath) => {
        if (!imgPath) return "https://via.placeholder.com/150";

        if (imgPath.startsWith("http")) {
            return imgPath;
        }

        if (imgPath.startsWith("/uploads")) {
            return `http://localhost:5000${imgPath}`;
        }

        return imgPath;
    };
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            
            setImage(data);
            setUploading(false);
            toast.success("Tải ảnh lên thành công!");
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error("Lỗi tải ảnh!");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/products/${productId}`,
                { name, price, image, brand, category, description, countInStock },
                config
            );

            toast.success("Cập nhật thành công");
            navigate("/admin/productlist");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Link to="/admin/productlist" className="text-gray-600 hover:text-pink-600 mb-4 inline-block font-medium">
                &larr; Quay lại danh sách
            </Link>

            <div className="flex justify-center">
                <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">
                        Chỉnh sửa sản phẩm
                    </h1>

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Tên sản phẩm</label>
                            <input type="text" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Giá (VNĐ)</label>
                                <input type="number" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                    value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Số lượng kho</label>
                                <input type="number" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                    value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Thương hiệu</label>
                                <input type="text" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                    value={brand} onChange={(e) => setBrand(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Danh mục</label>
                                <input type="text" className="w-full p-3 border rounded-lg focus:outline-pink-500"
                                    value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Hình ảnh</label>
                            
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-pink-500 mb-2 bg-gray-100 text-sm"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="Nhập link ảnh hoặc tải lên..."
                            />

                            <input 
                                type="file" 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                onChange={uploadFileHandler}
                            />
                            {uploading && <div className="text-sm text-blue-500 mt-1">Đang tải ảnh lên...</div>}

                            {image && (
                                <div className="mt-4 p-2 border rounded-lg inline-block bg-gray-50">
                                    <p className="text-xs text-gray-500 mb-1">Xem trước:</p>
                                    <img 
                                        src={getImgUrl(image)}
                                        alt="Preview"
                                        className="h-32 w-auto object-contain rounded border bg-white" 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/150?text=Lỗi+Ảnh";
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
                            <textarea className="w-full p-3 border rounded-lg focus:outline-pink-500 h-32"
                                value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>

                        <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 shadow-lg transition">
                            Lưu thay đổi
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEditPage;