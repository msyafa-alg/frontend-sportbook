import { Outlet } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import AuthProvider from "./context/AuthContext";

// Template.jsx : layout pembungkus semua halaman
// sama persis polanya dengan Template.jsx di template platzi-fake-store
export default function Template() {
    return (
        <>
            <AuthProvider>
                {/* navbar tampil di semua halaman */}
                <NavbarComponent />
                {/* Outlet : tempat halaman yang aktif ditampilkan (seperti @yield di Laravel) */}
                <Outlet />
            </AuthProvider>
        </>
    );
}
