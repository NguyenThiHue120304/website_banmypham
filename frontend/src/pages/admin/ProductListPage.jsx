import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ProductListPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        } catch (error) {
            toast.error("Lỗi tải sản phẩm");
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchProducts();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                toast.success('Đã xóa sản phẩm');
                fetchProducts();
            } catch (error) {
                toast.error('Lỗi xóa sản phẩm: ' + error.message);
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('/api/products', {}, config);
            toast.success('Đã tạo sản phẩm mẫu');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            toast.error('Lỗi tạo sản phẩm: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold uppercase text-gray-800">Quản lý Sản phẩm</h1>
                <button 
                    onClick={createProductHandler}
                    className="bg-pink-600 text-white px-4 py-2 rounded flex items-center hover:bg-pink-700 transition font-bold shadow"
                >
                    <FaPlus className="mr-2" /> Thêm sản phẩm
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-sm font-bold text-gray-600">
                        <tr>
                            <th className="p-4 border-b text-center w-16">STT</th>
                            <th className="p-4 border-b">Tên sản phẩm</th>
                            <th className="p-4 border-b">Giá</th>
                            <th className="p-4 border-b">Danh mục</th>
                            <th className="p-4 border-b">Thương hiệu</th>
                            <th className="p-4 border-b text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-center font-bold text-gray-500">
                                    {index + 1}
                                </td>

                                <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                                <td className="p-4 text-pink-600 font-bold">{product.price.toLocaleString()} đ</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">{product.brand}</td>
                                <td className="p-4 text-center">
                                    <Link to={`/admin/product/${product._id}/edit`}>
                                        <button className="text-blue-500 hover:text-blue-700 mr-3 p-2 bg-blue-50 rounded transition">
                                            <FaEdit />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;