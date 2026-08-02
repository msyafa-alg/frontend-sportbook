import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerService } from "../services/auth.service";
import { MdSportsSoccer } from "react-icons/md";
import { HiX, HiCheck } from "react-icons/hi";

export default function Register() {
    const [formValue, setFormValue] = useState({ name: "", username: "", password: "", email: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit() {
        if (!formValue.name || !formValue.username || !formValue.password) {
            setError("Semua field harus diisi!");
            return;
        }
        if (formValue.password.length < 6) {
            setError("Password minimal 6 karakter!");
            return;
        }
        setError("");
        registerProcess();
    }

    async function registerProcess() {
        setLoading(true);
        try {
            await registerService(formValue.name, formValue.username, formValue.password, formValue.email);
            setSuccess("Akun berhasil dibuat! Mengarahkan ke login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            setError(error.response?.data?.data || "Registrasi gagal, coba lagi!");
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
                    <h1 className="text-xl font-bold text-gray-900">Buat Akun Baru</h1>
                    <p className="text-sm text-gray-500 mt-1">Daftar gratis dan mulai booking</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded mb-4">
                            <HiX className="shrink-0" /> {error}
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2.5 rounded mb-4">
                            <HiCheck className="shrink-0" /> {success}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Budi Santoso"
                                onKeyUp={(e) => setFormValue({ ...formValue, name: e.target.value })}
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: budi123"
                                onKeyUp={(e) => setFormValue({ ...formValue, username: e.target.value })}
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Email <span className="text-gray-300">(opsional)</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Contoh: budi@email.com"
                                onKeyUp={(e) => setFormValue({ ...formValue, email: e.target.value })}
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Minimal 6 karakter"
                                onKeyUp={(e) => setFormValue({ ...formValue, password: e.target.value })}
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 rounded text-sm transition-colors mt-1"
                        >
                            {loading ? "Memproses..." : "REGISTER"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
