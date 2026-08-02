import { useState, useContext, useEffect } from "react";
import { Card, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProfileService, updateProfileService, changePasswordService } from "../services/auth.service";
import { MdSportsSoccer, MdHistory } from "react-icons/md";
import { HiX, HiCheck } from "react-icons/hi";

// Profile.jsx : halaman profil user yang sedang login
export default function Profile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(user);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [pictureFile, setPictureFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ganti password
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [passMsg, setPassMsg] = useState("");
    const [passErr, setPassErr] = useState("");
    const [saving, setSaving] = useState(false);
    const [savingPass, setSavingPass] = useState(false);

    async function loadProfile() {
        try {
            const res = await getProfileService();
            setProfile(res.data);
            setName(res.data.name);
            setEmail(res.data.email || "");
        } catch (e) { /* ignore */ }
    }

    useEffect(() => { loadProfile(); }, []);

    async function handleUpdate() {
        setError("");
        setMessage("");
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("name", name);
            fd.append("email", email);
            if (pictureFile) fd.append("profile_picture", pictureFile);
            const res = await updateProfileService(fd);
            setProfile(res.data);
            setMessage("Profil berhasil diperbarui.");
        } catch (e) {
            setError(e.response?.data?.data || "Gagal memperbarui profil.");
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword() {
        setPassErr("");
        setPassMsg("");
        if (!currentPass || !newPass) {
            setPassErr("Semua field harus diisi!");
            return;
        }
        setSavingPass(true);
        try {
            await changePasswordService(currentPass, newPass);
            setPassMsg("Password berhasil diubah.");
            setCurrentPass("");
            setNewPass("");
        } catch (e) {
            setPassErr(e.response?.data?.data || "Gagal mengubah password.");
        } finally {
            setSavingPass(false);
        }
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto flex flex-col gap-6">
                    <Card>
                        <div className="flex flex-col items-center">
                            <img
                                src={profile?.profile_picture || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                                alt={profile?.name}
                                className="w-24 h-24 rounded-full object-cover mb-4"
                            />
                            <h5 className="text-xl font-semibold text-gray-900 mb-1">{profile?.name}</h5>
                            <span className="text-sm text-gray-500 mb-3">@{profile?.username}</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profile?.role === "admin" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-700"}`}>
                                {profile?.role}
                            </span>
                        </div>

                        {/* form update profil */}
                        <div className="flex flex-col gap-3 mt-4 border-t border-gray-100 pt-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Edit Profil</div>
                            {message && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded"><HiCheck /> {message}</div>}
                            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded"><HiX /> {error}</div>}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nama</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Foto Profil</label>
                                <input type="file" accept="image/*" onChange={(e) => setPictureFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600" />
                            </div>
                            <Button color="warning" onClick={handleUpdate} disabled={saving} className="w-full">
                                {saving ? "Menyimpan..." : "Simpan Profil"}
                            </Button>
                        </div>

                        {/* ganti password */}
                        <div className="flex flex-col gap-3 mt-4 border-t border-gray-100 pt-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ganti Password</div>
                            {passMsg && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded"><HiCheck /> {passMsg}</div>}
                            {passErr && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded"><HiX /> {passErr}</div>}
                            <input type="password" placeholder="Password lama" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                            <input type="password" placeholder="Password baru (min 6)" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                            <Button outline color="gray" onClick={handleChangePassword} disabled={savingPass} className="w-full">
                                {savingPass ? "Menyimpan..." : "Ubah Password"}
                            </Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/fields">
                            <Button className="w-full">
                                <MdSportsSoccer className="w-4 h-4 mr-2" /> Lihat Lapangan
                            </Button>
                        </Link>
                        <Link to="/my-bookings">
                            <Button outline color="gray" className="w-full">
                                <MdHistory className="w-4 h-4 mr-2" /> Riwayat Booking
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}