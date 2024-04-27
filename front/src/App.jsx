import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import UserManagement from "./components/user-management/UserManagement";
import Navbar from "./components/navbar/Navbar";
import Main from "./components/main/Main";
import { getUsers } from "./server/api";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsersData = async () => {
      try {
        const response = await getUsers({});

        setUsers(response);
      } catch (e) {
        console.log(e);
      }
    };
    getUsersData();
  }, []);
  return (
    <>
      <Navbar
        users={users}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <Main users={users} setUsers={setUsers} isLoggedIn={isLoggedIn} />
          }
        />
        <Route
          path="api/users/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/api/users/register" element={<Register />} />
        <Route path="/admin" element={<UserManagement />} />
      </Routes>
    </>
  );
};

export default App;
