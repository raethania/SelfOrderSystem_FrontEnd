import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import Homepage from "@/pages/customer/Homepage";
import OrderPage from "@/pages/customer/OrderPage";
import OrderHistory from "@/pages/auth/OrderHistory";
import ProfilePage from "@/pages/customer/ProfilePage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/customer/home"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <Homepage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/new-order"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <OrderPage/>
          </ProtectedRoute>
        }
      />
{/* 
      <Route
        path="/customer/order-summary"
        element={
          // <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            
          // </ProtectedRoute>
        }
      /> */}

      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <div>customer Orders Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/menu"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <div>Menu Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/history"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <OrderHistory/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <ProfilePage/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashier/table-selection"
        element={
          <ProtectedRoute allowedRoles={["cashier", "admin"]}>
            <div>Table Selection Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashier/checkout/:orderId"
        element={
          <ProtectedRoute allowedRoles={["cashier", "admin"]}>
            <div>Checkout Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashier/orders"
        element={
          <ProtectedRoute allowedRoles={["cashier", "admin"]}>
            <div>Cashier Orders Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kitchen/dashboard"
        element={
          <ProtectedRoute allowedRoles={["kitchen", "admin"]}>
            <div>Kitchen Dashboard Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kitchen/queue"
        element={
          <ProtectedRoute allowedRoles={["kitchen", "admin"]}>
            <div>Kitchen Queue Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Menu Management Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Product Management Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Category Management Page</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Report Page</div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}