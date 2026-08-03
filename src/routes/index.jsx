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
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import About from "../pages/About";
import Faq from "../pages/Faq";
import ChatPage from "../pages/ChatPage";
import AccountDashboard from "../pages/AccountDashboard";
import BookingDetailPage from "../pages/BookingDetailPage";
import NotificationsPage from "../pages/NotificationsPage";
import VouchersPage from "../pages/VouchersPage";
import AdminChat from "../pages/admin/AdminChat";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminFields from "../pages/admin/AdminFields";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminVouchers from "../pages/admin/AdminVouchers";
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
            { path: "/terms", element: <Terms /> },
            { path: "/privacy", element: <Privacy /> },
            { path: "/about", element: <About /> },
            { path: "/faq", element: <Faq /> },
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
            { path: "/account", element: <AccountDashboard /> },
            { path: "/booking/:id", element: <BookingDetailPage /> },
            { path: "/notifications", element: <NotificationsPage /> },
            { path: "/promo", element: <VouchersPage /> },
            { path: "/chat", element: <ChatPage /> },
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
            { path: "/admin/vouchers", element: <AdminVouchers /> },
            { path: "/admin/chat", element: <AdminChat /> },
        ],
    },
]);
