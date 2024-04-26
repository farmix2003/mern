import { Delete, LockOpen } from "@mui/icons-material";
import React from "react";

const ToolBar = ({ handleDeleteUser, handleBlockUsers, handleUnblockUser }) => {
  return (
    <div className="w-full min-h-[30px] flex gap-5  my-5">
      <button
        className="bg-gray-600 px-3 py-1 text-white font-bold rounded"
        onClick={handleBlockUsers}
      >
        Block
      </button>
      <button
        className="bg-green-700 px-3 py-1 text-white font-bold rounded"
        onClick={handleUnblockUser}
      >
        <LockOpen />
      </button>
      <button
        onClick={handleDeleteUser}
        className="bg-red-600 px-3 py-1 text-white font-bold rounded"
      >
        <Delete />
      </button>
    </div>
  );
};

export default ToolBar;
