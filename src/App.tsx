import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import DocumentsDashboard from "./pages/Documents/Dashboard";
import DocumentDetail from "./pages/Documents/DocumentDetail";
import RoleManagement from "./pages/admin/RoleManagement";
import UserManagement from "./pages/admin/UserManagement";
import AuditLog from "./pages/admin/AuditLog";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Root redirect to signin */}
          <Route index element={<Navigate to="/signin" replace />} />

          {/* Protected Dashboard Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Home />} />

            {/* Documents */}
            <Route path="/documents" element={<DocumentsDashboard />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />

            {/* Admin Pages */}
            <Route path="/admin/roles" element={<RoleManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/audit-log" element={<AuditLog />} />
          </Route>

          {/* Public Auth Routes */}
          <Route path="/signin" element={
            <PublicRoute redirectTo="/dashboard">
              <SignIn />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute redirectTo="/dashboard">
              <SignUp />
            </PublicRoute>
          } />
          <Route path="/reset-password" element={
            <PublicRoute redirectTo="/dashboard">
              <ResetPassword />
            </PublicRoute>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
