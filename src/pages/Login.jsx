import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginService } from "../services/auth.service";
import { MdSportsSoccer } from "react-icons/md";
import { HiX } from "react-icons/hi";

export default function Login() {
    const [formValue, setFormValue] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { updateToken } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleSubmit() {
        if (!formValue.username || !formValue.password) {
            setError("Username dan password tidak boleh kosong!");
            return;
        }
        setError("");
        loginProcess();
    }

    async function loginProcess() {
        setLoading(true);
        try {
            const result = await loginService(formValue.username, formValue.password);
            localStorage.setItem("access_token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.data));
            updateToken(result.data.token, result.data.data);
            if (result.data.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError("Username atau password salah!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MdSportsSoccer className="text-white text-2xl" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Masuk ke SportBook</h1>
                    <p className="text-sm text-gray-500 mt-1">Booking lapangan favoritmu</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded mb-4">
                            <HiX className="shrink-0" /> {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                onKeyUp={(e) => setFormValue({ ...formValue, username: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                onKeyUp={(e) => setFormValue({ ...formValue, password: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 rounded text-sm transition-colors mt-1"
                        >
                            {loading ? "Memproses..." : "LOGIN"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
