import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavbarComponent from "./components/NavbarComponent";
import AuthProvider from "./context/AuthContext";

// Template.jsx : layout pembungkus semua halaman
export default function Template() {
    const location = useLocation();

    return (
        <>
            <AuthProvider>
                <NavbarComponent />
                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.main>
                </AnimatePresence>
            </AuthProvider>
        </>
    );
}