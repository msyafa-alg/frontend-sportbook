import { useState, useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { getFieldsService, createFieldService, updateFieldService, deleteFieldService } from "../../services/field.service";
import { HiCheck, HiX, HiPencil, HiTrash, HiPlus, HiDownload } from "react-icons/hi";
import { MdSportsSoccer } from "react-icons/md";
import { exportToExcel } from "../../utils/exportExcel";

export default function AdminFields() {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formValue, setFormValue] = useState({ name: "", sport_type: "", price_per_hour: "", description: "", image: null });

    async function getFields() {
        try {
            const result = await getFieldsService();
            setFields(result.data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    }

    function openCreateModal() {
        setEditData(null);
        setFormValue({ name: "", sport_type: "", price_per_hour: "", description: "", image: null });
        setError("");
        setShowModal(true);
    }

    function openEditModal(field) {
        setEditData(field);
        setFormValue({ name: field.name, sport_type: field.sport_type, price_per_hour: field.price_per_hour, description: field.description, image: null });
        setError("");
        setShowModal(true);
    }

    async function handleSubmit() {
        if (!formValue.name || !formValue.sport_type || !formValue.price_per_hour) {
            setError("Nama, jenis olahraga, dan harga wajib diisi!");
            return;
        }
        setSubmitLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("name", formValue.name);
            formData.append("sport_type", formValue.sport_type);
            formData.append("price_per_hour", formValue.price_per_hour);
            formData.append("description", formValue.description);
            if (formValue.image) formData.append("image", formValue.image);
            if (editData) {
                await updateFieldService(editData.id, formData);
                setSuccess("Lapangan berhasil diupdate!");
            } else {
                await createFieldService(formData);
                setSuccess("Lapangan berhasil ditambahkan!");
            }
            setShowModal(false);
            getFields();
        } catch (error) {
            setError(error.response?.data?.data || "Gagal menyimpan data!");
        } finally { setSubmitLoading(false); }
    }

    async function handleDelete(id) {
        if (!confirm("Yakin ingin menghapus lapangan ini?")) return;
        try {
            await deleteFieldService(id);
            setSuccess("Lapangan berhasil dihapus!");
            getFields();
        } catch (error) { setError("Gagal menghapus lapangan!"); }
    }

    function handleExport() {
        const data = fields.map((f) => ({
            "Nama Lapangan": f.name,
            "Jenis Olahraga": f.sport_type,
            "Harga per Jam (Rp)": f.price_per_hour,
            "Deskripsi": f.description || "-",
        }));
        exportToExcel(data, "Data_Lapangan", "Lapangan");
    }

    useEffect(() => { getFields(); }, []);

    if (loading) return <LoadingComponent />;

    return (
        <div>
            {/* header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Manajemen Lapangan</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{fields.length} lapangan terdaftar</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <HiDownload /> Export Excel
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <HiPlus /> Tambah Lapangan
                    </button>
                </div>
            </div>

            {/* notifikasi */}
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

            {/* tabel */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Nama Lapangan</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Jenis Olahraga</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Harga/Jam</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {fields.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-gray-400">
                                    <MdSportsSoccer className="text-3xl mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Belum ada lapangan</p>
                                </td>
                            </tr>
                        ) : fields.map((field) => (
                            <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-900">{field.name}</td>
                                <td className="px-5 py-3.5">
                                    <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {field.sport_type}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-orange-500">
                                    Rp {field.price_per_hour?.toLocaleString("id-ID")}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(field)} className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500 px-3 py-1.5 rounded-lg transition-colors">
                                            <HiPencil /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(field.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                            <HiTrash /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">{editData ? "Edit Lapangan" : "Tambah Lapangan"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><HiX /></button>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-lg">
                                    <HiX className="shrink-0" /> {error}
                                </div>
                            )}
                            {[
                                { label: "Nama Lapangan", key: "name", type: "text", placeholder: "Contoh: Lapangan Futsal A" },
                                { label: "Jenis Olahraga", key: "sport_type", type: "text", placeholder: "Contoh: Futsal, Badminton" },
                                { label: "Harga per Jam (Rp)", key: "price_per_hour", type: "number", placeholder: "Contoh: 100000" },
                            ].map((f) => (
                                <div key={f.key}>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={formValue[f.key]}
                                        placeholder={f.placeholder}
                                        onChange={(e) => setFormValue({ ...formValue, [f.key]: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={formValue.description}
                                    placeholder="Deskripsi lapangan..."
                                    onChange={(e) => setFormValue({ ...formValue, description: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormValue({ ...formValue, image: e.target.files[0] })}
                                    className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button onClick={handleSubmit} disabled={submitLoading} className="px-5 py-2 text-sm font-bold bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors">
                                {submitLoading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
