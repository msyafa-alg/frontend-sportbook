import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getProfileService, updateProfileService, changePasswordService } from "../services/auth.service";
import { getMyBookingsService } from "../services/booking.service";
import {
    Camera, Save, KeyRound, Loader2, CalendarCheck, CheckCircle, XCircle, Clock,
    Mail, UserRound, Award, LayoutDashboard, NotebookText, CalendarDays,
} from "lucide-react";

const BADGE = {
    pending: "bg-slate-100 text-slate-600",
    waiting_payment: "bg-violet-100 text-violet-700",
    paid: "bg-blue-100 text-blue-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-600",
    cancelled: "bg-slate-200 text-slate-600",
};
const BADGE_LABEL = {
    pending: "Pending", waiting_payment: "Menunggu Bayar", paid: "Sudah Bayar",
    approved: "Disetujui", rejected: "Ditolak", cancelled: "Dibatalkan",
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Profile() {
    const { user, updateToken } = useContext(AuthContext);
    const toast = useToast();
    const [profile, setProfile] = useState(user);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [passSaving, setPassSaving] = useState(false);
    const [passMsg, setPassMsg] = useState("");
    const [passErr, setPassErr] = useState("");

    const [bookings, setBookings] = useState([]);
    const [bookLoading, setBookLoading] = useState(true);

    async function loadProfile() {
        try { const r = await getProfileService(); setProfile(r.data); } catch (e) {}
    }
    async function loadBookings() {
        setBookLoading(true);
        try { const r = await getMyBookingsService({ limit: 20 }); setBookings(r.data.data || []); } catch (e) { setBookings([]); }
        finally { setBookLoading(false); }
    }

    useEffect(() => { loadProfile(); loadBookings(); }, []);

    function onFile(e) {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }

    async function saveProfile(e) {
        e.preventDefault();
        setMsg(""); setErr(""); setSaving(true);
        try {
            const fd = new FormData();
            fd.append("name", name);
            fd.append("email", email);
            if (file) fd.append("profile_picture", file);
            const r = await updateProfileService(fd);
            setProfile(r.data);
            updateToken(localStorage.getItem("access_token"), r.data);
            toast.success("Profil berhasil diperbarui.");
        } catch (e) {
            setErr(e.response?.data?.data || "Gagal memperbarui profil.");
        } finally { setSaving(false); }
    }

    async function changePass(e) {
        e.preventDefault();
        setPassMsg(""); setPassErr("");
        if (!oldPass || !newPass) { setPassErr("Semua field wajib diisi."); return; }
        if (newPass.length < 6) { setPassErr("Password baru minimal 6 karakter."); return; }
        setPassSaving(true);
        try {
            await changePasswordService(oldPass, newPass);
            toast.success("Password berhasil diubah.");
            setOldPass(""); setNewPass("");
        } catch (e) {
            setPassErr(e.response?.data?.data || "Gagal mengubah password.");
        } finally { setPassSaving(false); }
    }

    return (
        <div className="bg-canvas min-h-screen">
            <div className="bg-ink text-white">
                <div className="container mx-auto px-4 sm:px-6 py-12">
                    <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white/10">
                                <img src={preview || profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "U")}&background=2563eb&color=fff`} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-extrabold">{profile?.name || user?.name}</h1>
                            <p className="text-white/70 mt-0.5">@{profile?.username || user?.username}</p>
                            <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-white uppercase tracking-wider bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">
                                <Award className="w-3.5 h-3.5" /> {profile?.role || user?.role}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-6">
                {/* KIRI: ringkasan */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div initial="hidden" animate="show" variants={fadeUp} className="bg-card rounded-[20px] border border-line p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-4"><LayoutDashboard className="w-4 h-4 text-primary" /> Ringkasan Booking</div>
                        {bookLoading ? (
                            <div className="space-y-2"><div className="skeleton h-8 rounded" /><div className="skeleton h-8 rounded" /></div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-canvas p-4"><p className="text-3xl font-extrabold text-primary">{bookings.length}</p><p className="text-xs text-muted">Total</p></div>
                                <div className="rounded-2xl bg-canvas p-4"><p className="text-3xl font-extrabold text-emerald-600">{bookings.filter(b => b.status === "approved").length}</p><p className="text-xs text-muted">Aktif</p></div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* KANAN */}
                <div className="lg:col-span-2 space-y-6">
                    {/* edit profil */}
                    <motion.div initial="hidden" animate="show" variants={fadeUp} className="bg-card rounded-[20px] border border-line p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-5"><UserRound className="w-4 h-4 text-primary" /> Edit Profil</div>
                        {msg && <InfoBox type="ok" text={msg} onClose={() => setMsg("")} />}
                        {err && <InfoBox type="err" text={err} onClose={() => setErr("")} />}
                        <form onSubmit={saveProfile} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-muted mb-1.5">Foto Profil</label>
                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-line rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-pointer text-center">
                                    <Camera className="w-6 h-6 text-primary mb-2" />
                                    <p className="text-sm font-semibold text-ink">Klik untuk unggah foto</p>
                                    <p className="text-xs text-muted mt-1">JPG / PNG / WEBP, maks 2MB</p>
                                    <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                                </label>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted mb-1.5">Nama Lengkap</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted mb-1.5">Email</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition" />
                                </div>
                            </div>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Profil
                            </button>
                        </form>
                    </motion.div>

                    {/* ganti password */}
                    <motion.div initial="hidden" animate="show" variants={fadeUp} className="bg-card rounded-[20px] border border-line p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-5"><KeyRound className="w-4 h-4 text-primary" /> Ganti Password</div>
                        {passMsg && <InfoBox type="ok" text={passMsg} onClose={() => setPassMsg("")} />}
                        {passErr && <InfoBox type="err" text={passErr} onClose={() => setPassErr("")} />}
                        <form onSubmit={changePass} className="space-y-4 max-w-md">
                            <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} placeholder="Password lama" className="w-full rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/40" />
                            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Password baru (min 6 karakter)" className="w-full rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/40" />
                            <button type="submit" disabled={passSaving} className="inline-flex items-center gap-2 bg-ink hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-60">
                                {passSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Ubah Password
                            </button>
                        </form>
                    </motion.div>

                    {/* riwayat booking */}
                    <motion.div initial="hidden" animate="show" variants={fadeUp} className="bg-card rounded-[20px] border border-line p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-5"><NotebookText className="w-4 h-4 text-primary" /> Riwayat Booking</div>
                        {bookLoading ? (
                            <div className="space-y-3">{[0, 1].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-10 text-muted"><CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-semibold text-ink/70">Belum ada booking</p></div>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map((b) => (
                                    <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-line p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                                        <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0"><CalendarCheck className="w-5 h-5" /></span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-ink text-sm truncate">{b.Field?.name || "Lapangan"}</p>
                                            <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5"><CalendarDays className="w-3.5 h-3.5" />{b.booking_date} • {b.start_time?.slice(0,5)}–{b.end_time?.slice(0,5)}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-extrabold text-primary text-sm">Rp {b.total_price?.toLocaleString("id-ID")}</p>
                                            <span className={`inline-flex items-center gap-1 mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${BADGE[b.status] || "bg-slate-100"}`}>
                                                {b.status === "approved" ? <CheckCircle className="w-3 h-3" /> : b.status === "rejected" || b.status === "cancelled" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {BADGE_LABEL[b.status] || b.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function InfoBox({ type, text, onClose }) {
    const ok = type === "ok";
    return (
        <div className={`flex items-center justify-between gap-2 text-sm px-3.5 py-2.5 rounded-xl mb-4 ${ok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
            <span>{text}</span>
            <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
        </div>
    );
}