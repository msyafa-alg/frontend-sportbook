import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Template from "../Template";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Fields from "../pages/Fields";
import FieldDetail from "../pages/FieldDetail";
import MyBookings from "../pages/MyBookings";
import Profile from "../pages/Profile";
import BookingStruk from "../pages/BookingStruk";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminFields from "../pages/admin/AdminFields";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminUsers from "../pages/admin/AdminUsers";
import { auth, authAdmin } from "../middleware/auth";

export const router = createBrowserRouter([
    // ===== PUBLIC ROUTES (tidak perlu login) =====
    {
        path: "/",
        element: <Template />,
        children: [
            { path: "/", element: <App /> },
            { path: "/fields", element: <Fields /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },

    // ===== PROTECTED USER ROUTES (perlu login) =====
    {
        path: "/",
        element: <Template />,
        loader: auth,
        children: [
            { path: "/fields/:id", element: <FieldDetail /> },
            { path: "/my-bookings", element: <MyBookings /> },
            { path: "/profile", element: <Profile /> },
            { path: "/booking/struk", element: <BookingStruk /> },
        ],
    },

    // ===== ADMIN ROUTES (pakai AdminLayout dengan sidebar) =====
    {
        path: "/admin",
        element: <AdminLayout />,
        loader: authAdmin,
        children: [
            { path: "/admin", element: <AdminDashboard /> },
            { path: "/admin/fields", element: <AdminFields /> },
            { path: "/admin/bookings", element: <AdminBookings /> },
            { path: "/admin/payments", element: <AdminPayments /> },
            { path: "/admin/users", element: <AdminUsers /> },
        ],
    },
]);
