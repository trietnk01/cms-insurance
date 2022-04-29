import React, { useEffect, useState } from "react";

function ListCmp({ getItems }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(getItems());
    console.log("Updating Items");
  }, [getItems]);
  return (
    <div>
      {items.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </div>
  );
}

export default ListCmp;
