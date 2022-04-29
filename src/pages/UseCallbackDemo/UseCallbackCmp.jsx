import React, { useCallback, useState } from "react";
import ListCmp from "./ListCmp";

function UseCallbackCmp() {
  const [number, setNumber] = useState(1);
  const [dark, setDark] = useState(false);
  const getItems = useCallback(() => {
    console.log("useCallback");
    return [number, number + 1, number + 2];
  }, [number]);
  const theme = {
    backgroundColor: dark ? "#333" : "#FFF",
    color: dark ? "#FFF" : "#333",
  };
  return (
    <div style={theme}>
      <input type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))} />
      <button type="button" onClick={() => setDark((prevDark) => !prevDark)}>
        ToggleTheme
      </button>
      <ListCmp getItems={getItems} />
    </div>
  );
}

export default UseCallbackCmp;
