import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Navbar from "./components/navbar/Navbar";
import Main from "./components/main/Main";
import { getUsers } from "./server/api";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState("");

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
  }, [users]);
  return (
    <>
      <Navbar
        users={users}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        setIsLoggedIn={setIsLoggedIn}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              users={users}
              setUsers={setUsers}
              setUserInfo={setUserInfo}
            />
          }
        />
        <Route
          path="/home"
          element={
            <Main users={users} setUsers={setUsers} isLoggedIn={isLoggedIn} />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              users={users}
              setUsers={setUsers}
            />
          }
        />
        <Route
          path="/register"
          element={<Register users={users} setUsers={setUsers} />}
        />
      </Routes>
    </>
  );
};

export default App;
