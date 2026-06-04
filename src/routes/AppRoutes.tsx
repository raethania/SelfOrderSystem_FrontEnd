import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import Homepage from "@/pages/customer/Homepage";
import OrderPage from "@/pages/customer/OrderPage";
import OrderHistory from "@/pages/auth/OrderHistory";
import OrderHistoryDetailPage from "@/pages/auth/OrderHistoryDetailPage";
import ProfilePage from "@/pages/customer/ProfilePage";
import ProductDetailPage from "@/pages/customer/ProductDetailPage";

// Admin pages
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "@/pages/admin/AdminOrderDetailPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminTransactionsPage from "@/pages/admin/AdminTransactionsPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";


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

      <Route
        path="/customer/product/:id"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <ProductDetailPage />
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
        path="/customer/history/:id"
        element={
          <ProtectedRoute allowedRoles={["customer", "cashier", "admin"]}>
            <OrderHistoryDetailPage />
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

      {/* ===== Admin Routes ===== */}
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrderDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTransactionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReportsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}