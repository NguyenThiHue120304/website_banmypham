import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';

import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderPage from './pages/OrderPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';

import OrderListPage from './pages/admin/OrderListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import ProductListPage from './pages/admin/ProductListPage';
import UserListPage from './pages/admin/UserListPage';

function App() {
  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/order/:id" element={<OrderPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProductListPage />} />
          <Route path="dashboard" element={<ProductListPage />} />
          <Route path="productlist" element={<ProductListPage />} />
          <Route path="userlist" element={<UserListPage />} />
          <Route path="orderlist" element={<OrderListPage />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  )
}

export default App