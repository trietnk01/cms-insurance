import LoadingSnipper from "components/LoadingSnipper";
import Notify from "components/Notify";
import { PATH_NAME } from "configs";
import AuthGuard from "guards/AuthGuard";
import GuestGuard from "guards/GuestGuard";
import AdminMaster from "layouts/AdminMaster";
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
const Login = lazy(() => import("pages/Login"));
const Dashboard = lazy(() => import("pages/Dashboard"));
const NoMatchFrm = lazy(() => import("pages/NoMatchFrm"));
const CategoryProductList = lazy(() => import("pages/CategoryProduct/CategoryProductList"));
const CategoryProductFrm = lazy(() => import("pages/CategoryProduct/CategoryProductFrm"));
const ProductList = lazy(() => import("pages/Product/ProductList"));
const ProductFrm = lazy(() => import("pages/Product/ProductFrm"));
const UserList = lazy(() => import("pages/User/UserList"));
const UserFrm = lazy(() => import("pages/User/UserFrm"));
function RoutesMain() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route
            path={PATH_NAME.ADMIN_LOGIN}
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />
          <Route path={PATH_NAME.ADMIN_MASTER} element={<AdminMaster />}>
            <Route path="*" element={<NoMatchFrm />} />
            <Route
              path={PATH_NAME.ADMIN_DASHBOARD}
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route path={PATH_NAME.ADMIN_CATEGORY_PRODUCT}>
              <Route
                index
                element={
                  <AuthGuard>
                    <CategoryProductList />
                  </AuthGuard>
                }
              />
              <Route
                path="list"
                element={
                  <AuthGuard>
                    <CategoryProductList />
                  </AuthGuard>
                }
              />
              <Route
                path="add"
                element={
                  <AuthGuard>
                    <CategoryProductFrm />
                  </AuthGuard>
                }
              />
              <Route
                path=":categoryProductId"
                element={
                  <AuthGuard>
                    <CategoryProductFrm />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<NoMatchFrm />} />
            </Route>
            <Route path={PATH_NAME.ADMIN_PRODUCT}>
              <Route
                index
                element={
                  <AuthGuard>
                    <ProductList />
                  </AuthGuard>
                }
              />
              <Route
                path="list"
                element={
                  <AuthGuard>
                    <ProductList />
                  </AuthGuard>
                }
              />
              <Route
                path="add"
                element={
                  <AuthGuard>
                    <ProductFrm />
                  </AuthGuard>
                }
              />
              <Route
                path=":productId"
                element={
                  <AuthGuard>
                    <ProductFrm />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<NoMatchFrm />} />
            </Route>
            <Route path={PATH_NAME.ADMIN_USER}>
              <Route
                index
                element={
                  <AuthGuard>
                    <UserList />
                  </AuthGuard>
                }
              />
              <Route
                path="list"
                element={
                  <AuthGuard>
                    <UserList />
                  </AuthGuard>
                }
              />
              <Route
                path="add"
                element={
                  <AuthGuard>
                    <UserFrm />
                  </AuthGuard>
                }
              />
            </Route>
          </Route>
          <Route path="" element={<Navigate to={`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_DASHBOARD}`} />} />
          <Route path="*" element={<NoMatchFrm />} />
        </Routes>
        <Notify />
        <LoadingSnipper />
      </Suspense>
    </BrowserRouter>
  );
}

export default RoutesMain;
