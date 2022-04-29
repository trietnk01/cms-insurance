import React, { Fragment, useMemo, useState } from "react";
function slowFunction(num) {
  console.log("slowFunction");
  let a = 0;
  for (let i = 0; i <= 1000000; i++) {
    a = i;
  }
  return num * a;
}
function UseMemoCmp() {
  const [number, setNumber] = useState(0);
  const [dark, setDark] = useState(false);
  const doubleNumber = useMemo(() => {
    return slowFunction(number);
  }, [number]);
  const themeStyles = {
    backgroundColor: dark ? "#333" : "#FFF",
    color: dark ? "#FFF" : "#333",
  };
  return (
    <Fragment>
      <input type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))} />
      <button type="button" onClick={() => setDark((prevDark) => !prevDark)}>
        Change Theme
      </button>
      <div style={themeStyles}>{doubleNumber}</div>
    </Fragment>
  );
}

export default UseMemoCmp;
