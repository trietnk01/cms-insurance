import axios from "axios";
import { API_ENDPOINT, NOTI_CONFIRMED_DELETE, NOTI_DELETE_FAIL, NOTI_DELETE_SUCCESSFULLY, NOTI_TYPE_DANGER, NOTI_TYPE_SUCCESS, NOTI_TYPE_WARNING, PATH_NAME, TIME_OUT } from "configs";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import loadingSlice from "redux/loadingSlice";
import notifySlice from "redux/notifySlice";
function CategoryProductList() {
  let dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [ids, setIds] = useState([]);
  useEffect(() => {
    dispatch(loadingSlice.actions.show());
    axios({
      method: "GET",
      url: `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}`,
      timeout: TIME_OUT,
    })
      .then((res) => {
        if (res && parseInt(res.status) === 200 && res.data.checked === true && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setData(res.data.data);
        } else {
          let msg = new Array();
          msg = res.data.msg.map((elmt) => {
            return elmt;
          });
          dispatch(
            notifySlice.actions.showNotify({
              type: NOTI_TYPE_DANGER,
              msg,
            })
          );
        }
        dispatch(loadingSlice.actions.hide());
      })
      .catch(function (err) {
        dispatch(loadingSlice.actions.hide());
        dispatch(
          notifySlice.actions.showNotify({
            type: NOTI_TYPE_DANGER,
            msg: err.message,
          })
        );
      });
  }, []);
  function handleDelete(id) {
    let confirmed = false;
    let alertTxt = NOTI_CONFIRMED_DELETE;
    let msg = new Array();
    let typeNotify = "";
    if (window.confirm(alertTxt)) {
      confirmed = true;
    }
    if (confirmed) {
      dispatch(loadingSlice.actions.show());
      axios({
        method: "DELETE",
        url: `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/${id}`,
        timeout: TIME_OUT,
      })
        .then((res) => {
          if (res && parseInt(res.status) === 200) {
            if (res.data.checked === true) {
              msg.push(NOTI_DELETE_SUCCESSFULLY);
              typeNotify = NOTI_TYPE_SUCCESS;
              setData(res.data.data);
            } else {
              msg = res.data.msg.map((element) => {
                return element;
              });
              typeNotify = NOTI_TYPE_WARNING;
            }
          } else {
            msg.push(NOTI_DELETE_FAIL);
            typeNotify = NOTI_TYPE_DANGER;
          }
          dispatch(loadingSlice.actions.hide());
          dispatch(
            notifySlice.actions.showNotify({
              type: typeNotify,
              msg,
            })
          );
        })
        .catch((err) => {
          dispatch(loadingSlice.actions.hide());
          dispatch(
            notifySlice.actions.showNotify({
              type: NOTI_TYPE_DANGER,
              msg: err.message,
            })
          );
        });
    }
  }
  function handleCheckAll() {
    if (Array.isArray(data) && Array.isArray(ids) && parseInt(data.length) === parseInt(ids.length)) {
      setIds([]);
    } else {
      setIds(
        data.map((item) => {
          return parseInt(item.id);
        })
      );
    }
  }
  function handleDeleteAll() {
    let confirmed = false;
    let msg = new Array();
    let typeNotify = "";
    let alertTxt = NOTI_CONFIRMED_DELETE;
    if (window.confirm(alertTxt)) {
      confirmed = true;
    }
    if (confirmed) {
      let data = { idsDeleted: ids };
      dispatch(loadingSlice.actions.show());
      axios({
        method: "POST",
        url: `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}`,
        timeout: TIME_OUT,
        data,
      })
        .then((res) => {
          if (res && parseInt(res.status) === 200) {
            if (res.data.checked === true) {
              setData(res.data.data);
              setIds([]);
              msg.push(NOTI_DELETE_SUCCESSFULLY);
              typeNotify = NOTI_TYPE_SUCCESS;
            } else {
              msg = res.data.msg.map((element) => {
                return element;
              });
              typeNotify = NOTI_TYPE_WARNING;
            }
          } else {
            msg.push(NOTI_DELETE_FAIL);
            typeNotify = NOTI_TYPE_DANGER;
          }
          dispatch(loadingSlice.actions.hide());
          dispatch(
            notifySlice.actions.showNotify({
              type: typeNotify,
              msg,
            })
          );
        })
        .catch((err) => {
          dispatch(loadingSlice.actions.hide());
          dispatch(
            notifySlice.actions.showNotify({
              typeNotify: NOTI_TYPE_DANGER,
              msg: err.message,
            })
          );
        });
    }
  }
  const handleCheckItem = (id) => () => {
    let idFounded = ids.find((element) => {
      return parseInt(element) === parseInt(id);
    });
    if (idFounded) {
      setIds(
        ids.filter((item) => {
          return parseInt(item) !== parseInt(id);
        })
      );
    } else {
      setIds([...ids, id]);
    }
  };
  const renderTr = () => {
    let htmlTr = null;
    if (Array.isArray(data) && data.length > 0) {
      htmlTr = data.map((item, idx) => {
        return (
          <tr key={idx}>
            <td className="border-b border-r p-2">
              <input type="checkbox" value={item.id} checked={ids.find((element) => parseInt(element) === parseInt(item.id)) ? true : false} onChange={handleCheckItem(item.id)} />
            </td>
            <td className="border-b border-r p-2">{item.fullname}</td>
            <td className="border-b border-r p-2 text-center">
              <Link to={`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/${item.id}`} className="border-0 bg-transparent">
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </Link>
            </td>
            <td className="border-b border-r p-2 text-center">
              <button type="button" onClick={() => handleDelete(item.id)} className="border-0 bg-transparent">
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        );
      });
    }
    return htmlTr;
  };
  return (
    <div className="border p-5 border-slate-300">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-x-2">
          <i className="fa fa-address-book-o" aria-hidden="true"></i>
          <span>Category product</span>
        </div>
        <div className="flex justify-end gap-x-2">
          <Link to={`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/add`} className="no-underline flex justify-center items-center gap-x-2 bg-blue-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Add new</span>
            <i className="fa fa-plus text-white" aria-hidden="true"></i>
          </Link>
          <button type="button" onClick={handleDeleteAll} className="flex justify-center items-center gap-x-2 bg-red-500 text-white border-0 p-2 hover:bg-red-600">
            <span className="text-white">Delete</span>
            <i className="fa fa-trash text-white" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <hr className="my-2" />
      <form name="gridFrm">
        <table className="w-full border-t border-l">
          <thead>
            <tr>
              <th className="border-b border-r p-2 text-center" style={{ width: "30px" }}>
                <input type="checkbox" checked={Array.isArray(data) && Array.isArray(ids) && parseInt(data.length) === parseInt(ids.length) ? true : false} onChange={handleCheckAll} />
              </th>
              <th className="border-b border-r p-2 text-center">Category name</th>
              <th className="border-b border-r p-2 text-center" style={{ width: "50px" }}>
                Edit
              </th>
              <th className="border-b border-r p-2 text-center" style={{ width: "50px" }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>{renderTr()}</tbody>
        </table>
      </form>
    </div>
  );
}

export default CategoryProductList;
