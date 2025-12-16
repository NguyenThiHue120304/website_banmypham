import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const UserLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;