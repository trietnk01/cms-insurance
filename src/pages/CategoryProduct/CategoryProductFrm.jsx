import axios from "axios";
import { ADMIN_FOLDER, API_ENDPOINT, NOTI_SAVE_FAIL, NOTI_SAVE_SUCCESSFULLY, NOTI_TYPE_DANGER, NOTI_TYPE_SUCCESS, NOTI_TYPE_WARNING, PATH_NAME, TIME_OUT } from "configs";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import loadingSlice from "redux/loadingSlice";
import notifySlice from "redux/notifySlice";
function CategoryProductFrm() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let { categoryProductId } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    let msg = new Array(0);
    let typeNotify = "";
    let url = "";
    let method = "";
    dispatch(loadingSlice.actions.show());
    if (parseInt(categoryProductId).toString() !== "NaN") {
      method = "PUT";
      url = `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/${parseInt(categoryProductId)}`;
    } else {
      method = "POST";
      url = `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}`;
    }
    axios({
      method,
      url,
      data,
      timeout: TIME_OUT,
    })
      .then((res) => {
        if (res && parseInt(res.status) === 200) {
          if (res.data.checked === true) {
            msg.push(NOTI_SAVE_SUCCESSFULLY);
            typeNotify = NOTI_TYPE_SUCCESS;
            navigate(`/${ADMIN_FOLDER}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/${parseInt(res.data.item.id)}`);
          } else {
            res.data.msg.forEach((element) => {
              msg.push(element);
            });
            typeNotify = NOTI_TYPE_WARNING;
          }
        } else {
          msg.push(NOTI_SAVE_FAIL);
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
  };
  useEffect(() => {
    if (parseInt(categoryProductId).toString() === "NaN") {
      setValue("fullname", "");
    }
  }, [categoryProductId]);

  useEffect(() => {
    if (parseInt(categoryProductId).toString() !== "NaN") {
      dispatch(loadingSlice.actions.show());
      axios({
        method: "GET",
        url: `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/${parseInt(categoryProductId)}`,
        timeout: TIME_OUT,
      })
        .then((res) => {
          if (res && parseInt(res.status) === 200 && res.data) {
            setValue("fullname", res.data.fullname);
            setValue("alias", res.data.alias);
          } else {
            navigate("*");
          }
          dispatch(loadingSlice.actions.hide());
        })
        .catch((err) => {
          dispatch(loadingSlice.actions.hide());
          dispatch(
            notifySlice.actions.showNotify({
              type: NOTI_TYPE_DANGER,
              msg: err.message,
            })
          );
          navigate("*");
        });
    }
  }, []);
  return (
    <form className="border p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-x-2">
          <i className="fa fa-address-book-o" aria-hidden="true"></i>
          <span>Category Product</span>
        </div>
        <div className="flex justify-end gap-x-2">
          <Link to={`/${ADMIN_FOLDER}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/add`} className="no-underline flex justify-center items-center gap-x-2 bg-blue-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Add new</span>
            <i className="fa fa-plus text-white" aria-hidden="true"></i>
          </Link>
          <button name="btnSubmit" type="submit" className="no-underline flex justify-center items-center gap-x-2 bg-green-500 text-white border-0 p-2 hover:bg-green-600">
            <span className="text-white">Submit</span>
            <i className="fa fa-floppy-o text-white" aria-hidden="true"></i>
          </button>
          <Link to={`/${ADMIN_FOLDER}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}/list`} className="no-underline flex justify-center items-center gap-x-2 bg-red-500 text-white border-0 p-2 hover:bg-red-600">
            <span className="text-white">Back</span>
            <i className="fa fa-backward text-white" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
      <hr className="my-2" />
      <div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">Cate product name</div>
            <div className="grow">
              <input type="text" className="border border-gray-400 w-full p-2 " {...register("fullname", { required: true })} />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.fullname && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">Alias</div>
            <div className="grow">
              <input type="text" className="border border-gray-400 w-full p-2 " {...register("alias", { required: true })} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CategoryProductFrm;
