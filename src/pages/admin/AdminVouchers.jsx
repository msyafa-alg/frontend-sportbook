import { useState, useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { getAllVouchersService, createVoucherService, deleteVoucherService } from "../../services/voucher.service";
import { HiX, HiCheck, HiPlus, HiTrash, HiTicket } from "react-icons/hi";

const emptyForm = { code: "", discount_type: "percent", discount_value: "", min_order: "", max_uses: "" };

export default function AdminVouchers() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    async function getVouchers() {
        setLoading(true);
        try {
            const r = await getAllVouchersService();
            setVouchers(r.data);
        } catch (e) { setError("Gagal mengambil voucher"); }
        finally { setLoading(false); }
    }

    async function handleCreate() {
        if (!form.code || !form.discount_value) { setError("Kode dan nilai diskon wajib diisi!"); return; }
        setSaving(true); setError("");
        try {
            await createVoucherService(form);
            setSuccess("Voucher berhasil dibuat.");
            setShowModal(false);
            setForm(emptyForm);
            getVouchers();
        } catch (e) { setError(e.response?.data?.data || "Gagal membuat voucher"); }
        finally { setSaving(false); }
    }

    async function handleDelete(id) {
        if (!confirm("Hapus voucher ini?")) return;
        try {
            await deleteVoucherService(id);
            setSuccess("Voucher dihapus.");
            getVouchers();
        } catch (e) { setError("Gagal menghapus voucher"); }
    }

    useEffect(() => { getVouchers(); }, []);

    if (loading && vouchers.length === 0) return <LoadingComponent />;

    const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Kode Voucher</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{vouchers.length} voucher aktif</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
                    <HiTicket /> Tambah Voucher
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-4">
                    <HiX className="shrink-0" /> <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto">✕</button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded mb-4">
                    <HiCheck className="shrink-0" /> <span>{success}</span>
                    <button onClick={() => setSuccess("")} className="ml-auto">✕</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {["Kode", "Tipe", "Diskon", "Min Order", "Pemakaian", "Status", "Aksi"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {vouchers.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Belum ada voucher</td></tr>
                            ) : vouchers.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3 font-mono font-bold text-blue-600">{v.code}</td>
                                    <td className="px-5 py-3 text-gray-500">{v.discount_type}</td>
                                    <td className="px-5 py-3 font-semibold text-gray-800">
                                        {v.discount_type === "percent" ? `${v.discount_value}%` : `Rp ${v.discount_value?.toLocaleString("id-ID")}`}
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{v.min_order ? `Rp ${v.min_order?.toLocaleString("id-ID")}` : "-"}</td>
                                    <td className="px-5 py-3 text-gray-500">{v.used_count}{v.max_uses ? `/${v.max_uses}` : ""}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                            {v.active ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => handleDelete(v.id)} className="text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Buat Voucher</h3>
                            <button onClick={() => setShowModal(false)}><HiX /></button>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Kode</label>
                                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SPORT20" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Tipe</label>
                                <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className={inputCls}>
                                    <option value="percent">Persen (%)</option>
                                    <option value="fixed">Nominal (Rp)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Nilai Diskon</label>
                                <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="20" className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Min Order (0=tanpa)</label>
                                    <input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} placeholder="100000" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Max Pakai (0=tanpa)</label>
                                    <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="0" className={inputCls} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Batal</button>
                            <button onClick={handleCreate} disabled={saving} className="px-5 py-2 text-sm font-bold bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg">
                                {saving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}