import { useState, useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { getAllUsersService, toggleBlockUserService, changeUserRoleService, resetUserPasswordService } from "../../services/user.service";
import { HiX, HiCheck, HiSearch, HiBan } from "react-icons/hi";
import { MdGroup } from "react-icons/md";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resetTarget, setResetTarget] = useState(null);
    const [resetPass, setResetPass] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    async function getUsers(p = 1, q = "") {
        setLoading(true);
        try {
            const result = await getAllUsersService({ page: p, limit: 10, search: q });
            setUsers(result.data.data);
            setTotalPage(result.data.totalPage);
            setPage(p);
        } catch (e) {
            setError("Gagal mengambil data user");
        } finally {
            setLoading(false);
        }
    }

    async function handleBlock(id) {
        try {
            await toggleBlockUserService(id);
            setSuccess("Status user berhasil diubah.");
            getUsers(page, search);
        } catch (e) {
            setError(e.response?.data?.data || "Gagal mengubah status");
        }
    }

    async function handleRole(id, role) {
        if (!confirm(`Ubah role user ini menjadi "${role}"?`)) return;
        try {
            await changeUserRoleService(id, role);
            setSuccess("Role user berhasil diubah.");
            getUsers(page, search);
        } catch (e) {
            setError(e.response?.data?.data || "Gagal mengubah role");
        }
    }

    async function handleReset() {
        if (!resetPass || resetPass.length < 6) {
            setError("Password baru minimal 6 karakter!");
            return;
        }
        setResetLoading(true);
        try {
            await resetUserPasswordService(resetTarget.id, resetPass);
            setSuccess(`Password ${resetTarget.username} berhasil di-reset.`);
            setResetTarget(null);
            setResetPass("");
        } catch (e) {
            setError(e.response?.data?.data || "Gagal reset password");
        } finally {
            setResetLoading(false);
        }
    }

    useEffect(() => { getUsers(); }, []);

    function doSearch(val) {
        setSearch(val);
        getUsers(1, val);
    }

    if (loading && users.length === 0) return <LoadingComponent />;

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Manajemen User</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{users.length} user ditampilkan</p>
                </div>
                <input
                    type="text"
                    placeholder="Cari nama / username / email..."
                    value={search}
                    onChange={(e) => doSearch(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    <HiX className="shrink-0" /> <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto">✕</button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
                    <HiCheck className="shrink-0" /> <span>{success}</span>
                    <button onClick={() => setSuccess("")} className="ml-auto">✕</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {["User", "Email", "Role", "Status", "Aksi"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-400">
                                        <MdGroup className="text-3xl mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Belum ada user</p>
                                    </td>
                                </tr>
                            ) : users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="font-medium text-gray-900">{u.name}</p>
                                        <p className="text-xs text-gray-400">@{u.username}{u.email ? ` • ${u.email}` : ""}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.status === "blocked" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                                            {u.status === "blocked" ? "Diblokir" : "Aktif"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {u.username !== "admin" && (
                                                <>
                                                    <button
                                                        onClick={() => handleRole(u.id, u.role === "admin" ? "user" : "admin")}
                                                        className="text-xs font-semibold text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 px-2.5 py-1 rounded-lg transition-colors"
                                                    >
                                                        {u.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                                                    </button>
                                                    <button
                                                        onClick={() => setResetTarget(u)}
                                                        className="text-xs font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                                                    >
                                                        Reset Pass
                                                    </button>
                                                    <button
                                                        onClick={() => handleBlock(u.id)}
                                                        className="flex items-center gap-1 text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
                                                    >
                                                        <HiBan /> {u.status === "blocked" ? "Aktifkan" : "Blokir"}
                                                    </button>
                                                </>
                                            )}
                                            {u.username === "admin" && <span className="text-gray-300 text-xs">—</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* pagination */}
            {totalPage > 1 && (
                <div className="flex items-center gap-2 mt-4">
                    <button
                        disabled={page <= 1}
                        onClick={() => getUsers(page - 1, search)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                    >
                        Prev
                    </button>
                    <span className="text-xs text-gray-500">Halaman {page} / {totalPage}</span>
                    <button
                        disabled={page >= totalPage}
                        onClick={() => getUsers(page + 1, search)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* modal reset password */}
            {resetTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Reset Password</h3>
                            <button onClick={() => setResetTarget(null)} className="text-gray-400 hover:text-gray-600"><HiX /></button>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-3">
                            <p className="text-xs text-gray-500">Password baru untuk <b>@{resetTarget.username}</b></p>
                            <input
                                type="text"
                                value={resetPass}
                                placeholder="Password baru (min 6 karakter)"
                                onChange={(e) => setResetPass(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                            <button onClick={() => setResetTarget(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button onClick={handleReset} disabled={resetLoading} className="px-5 py-2 text-sm font-bold bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors">
                                {resetLoading ? "Menyimpan..." : "Reset"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}