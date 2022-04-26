import useSafeState from "hooks/useSafeState";
import React, { useEffect } from "react";

function UserList() {
  const [data, setData] = useSafeState("");
  useEffect(() => {
    console.log("UserList - useEffect");
    setTimeout(() => {
      setData("UserList");
    }, 5000);
  }, []);
  console.log("UserList");
  return <div>{data}</div>;
}

export default UserList;
