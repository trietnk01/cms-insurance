import { ADMIN_FOLDER } from "configs";
import React from "react";
import { Link } from "react-router-dom";

function UserList() {
  return (
    <div className="border p-5 border-slate-300">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-x-2">
          <i className="fa fa-address-book-o" aria-hidden="true"></i>
          <span>USER</span>
        </div>
        <div className="flex justify-end gap-x-2">
          <Link to={`/${ADMIN_FOLDER}/user/add`} className="no-underline flex justify-center items-center gap-x-2 bg-blue-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Add new</span>
            <i className="fa fa-plus text-white" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserList;
