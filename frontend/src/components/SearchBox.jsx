import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="relative flex items-center w-full max-w-md mx-auto">
            <input
                type="text"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
            />
            <button type="submit" className="absolute right-3 text-gray-500 hover:text-pink-600 transition">
                <FaSearch />
            </button>
        </form>
    );
};

export default SearchBox;