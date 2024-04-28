import moment from "moment";
import * as React from "react";
import ToolBar from "../toolbar/ToolBar";
import { blockUser, deleteUser, unblockUser } from "../../server/api";
import { useNavigate } from "react-router-dom";

function Main({ users, setUsers, isLoggedIn, setIsLoggedIn }) {
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [selectAllUsers, setSelectAllUsers] = React.useState(false);

  const navigate = useNavigate();

  const handleSelectionChange = (userId) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers(selectAllUsers ? [] : users.map((user) => user._id));
    setSelectAllUsers(!selectAllUsers);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUsers);
      const updatedUsers = users.filter(
        (user) => !selectedUsers.includes(user.id)
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlockUsers = async () => {
    try {
      await blockUser(selectedUsers);
      const updatedUsers = users.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "blocked" } : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnblockUser = async () => {
    try {
      await unblockUser(selectedUsers);
      const updatedUsers = users.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "active" } : user
      );
      setUsers(updatedUsers);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    const allUsersBlocked = users.every((user) => user.status === "blocked");
    if (allUsersBlocked && isLoggedIn) {
      navigate("/");
      setIsLoggedIn(() => false);
    } else {
      return;
    }
  }, [users, isLoggedIn, navigate]);
  return (
    <div style={{ height: 400, width: "80%", marginLeft: "100px" }}>
      <ToolBar
        handleDeleteUser={handleDeleteUser}
        handleBlockUsers={handleBlockUsers}
        handleUnblockUser={handleUnblockUser}
      />
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAllUsers}
                onChange={handleSelectAllUsers}
              />
            </th>
            <th>ID</th>
            <th> Full Name</th>
            <th>Email</th>
            <th>Last Login Time</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row) => (
            <tr key={row._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(row._id)}
                  onChange={() => handleSelectionChange(row._id)}
                />
              </td>
              <td>{row._id.slice(3, 7)}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>
                {moment(row.last_login_time).format("DD MMM, YYYY hh:mm:ss")}
              </td>
              <td>
                {moment(row.registration_time).format("DD MMM, YYYY hh:mm:ss")}
              </td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Main;
