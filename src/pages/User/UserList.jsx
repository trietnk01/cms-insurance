import useSafeState from "hooks/useSafeState";
import React, { useEffect } from "react";

function UserList() {
  const [data, setData] = useSafeState("");
  useEffect(() => {
    setTimeout(() => {
      setData("UserList");
    }, 3000);
  }, []);
  return <div>{data}</div>;
}

export default UserList;
