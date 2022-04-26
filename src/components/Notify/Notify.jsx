import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import notifySlice from "redux/notifySlice";
import { getMsgNotify, getTypeNotify, isShowNotify } from "redux/selector";

function Notify() {
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(notifySlice.actions.hideNotify());
  }
  useEffect(() => {
    let timer = setTimeout(function () {
      dispatch(notifySlice.actions.hideNotify());
    }, 30000);
    return () => {
      clearTimeout(timer);
    };
  });
  const renderFrm = () => {
    let frm = null;
    let alertHtml = null;
    let isShow = useSelector(isShowNotify);
    let typeNotify = useSelector(getTypeNotify);
    let msgNotify = useSelector(getMsgNotify);
    let elShow = "";
    let displayNotify = "hidden";
    if (isShow && Array.isArray(msgNotify) && msgNotify.length > 0) {
      alertHtml = msgNotify.map((item, idx) => {
        return <li key={idx}>{item}</li>;
      });
      elShow = "el-show";
      displayNotify = "block";
    }
    let bgColor = "";
    switch (typeNotify) {
      case "danger":
        bgColor = "bg-red-400";
        break;
      case "warning":
        bgColor = "bg-yellow-400";
        break;
      case "success":
        bgColor = "bg-cyan-400";
        break;
    }
    frm = (
      <div className={`notify-container bg-screenOpacity fixed top-0 left-0 w-screen h-screen ${elShow} ${displayNotify}`}>
        <div className={`alert-container top-1/2 left-1/2 p-2 rounded absolute ${bgColor}`}>
          <div className="close bg-white absolute rounded-full">
            <button type="button" name="btnClose" className="bg-transparent border-0 flex w-full h-full items-center justify-center" onClick={handleClose}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <ul className="mb-0">{alertHtml}</ul>
        </div>
      </div>
    );
    return frm;
  };
  return <Fragment>{renderFrm()}</Fragment>;
}

export default Notify;
