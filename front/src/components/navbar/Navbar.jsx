import React from "react";
import { logoutUser } from "../../server/api";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn, userInfo, setUserInfo }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      const response = logoutUser();
      setIsLoggedIn(() => false);
      setUserInfo(() => "");
      navigate("/login");
      return response;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-red-400/10 flex justify-center gap-5 h-[7vh] items-center mb-5">
        {isLoggedIn && (
          <>
            <span className="font-bold">{userInfo}</span>
            <button
              className="font-bold text-red-500 text-[18px] "
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
