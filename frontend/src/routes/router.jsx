import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import Dashboard from "../pages/Dashboard/Dashboard";

import LeadList from "../pages/Leads/LeadList";
import CreateLead from "../pages/Leads/CreateLead";
import EditLead from "../pages/Leads/EditLead";
import LeadDetails from "../pages/Leads/LeadDetails";

import UserList from "../pages/Users/UserList";
import EditUser from "../pages/Users/EditUser";



import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

function AppRouter() {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* All routes inside this layout require authentication */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Lead management routes */}
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/create" element={<CreateLead />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/leads/:id/edit" element={<EditLead />} />

        {/* Admin-only User Management routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUser />
            </ProtectedRoute>
          }
        />


      </Route>

      {/* fallback routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
