import { useState, useEffect } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { getNotificationsService, readAllNotificationsService } from "../services/notification.service";
import { Bell, CheckCircle2, AlertCircle, Info, CalendarCheck } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useSeo } from "../utils/seo";
import FooterComponent from "../components/FooterComponent";

const TYPE_CONFIG = {
    approved: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    rejected: { icon: <AlertCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-50" },
    payment_paid: { icon: <CalendarCheck className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
    booking_created: { icon: <CalendarCheck className="w-5 h-5 text-sky-600" />, bg: "bg-sky-50" },
    cancelled: { icon: <Info className="w-5 h-5 text-slate-500" />, bg: "bg-slate-50" },
};

export default function NotificationsPage() {
    useSeo("Notifikasi", "Daftar seluruh notifikasi pemesanan dan aktivitas di SportBook.");
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    async function load() {
        try {
            const r = await getNotificationsService({ limit: 40 });
            setList(r.data.list || []);
        } catch (e) {
            toast.error("Gagal memuat notifikasi.");
        } finally {
            setLoading(false);
        }
    }

    async function handleMarkAll() {
        try {
            await readAllNotificationsService();
            setList(l => l.map(n => ({ ...n, is_read: true })));
            toast.success("Semua notifikasi ditandai sudah dibaca.");
        } catch (e) {
            toast.error("Gagal memperbarui status.");
        }
    }

    useEffect(() => { load(); }, []);

    return (
        <div className="bg-canvas min-h-screen flex flex-col">
            <div className="container mx-auto px-4 sm:px-6 py-8 flex-1 max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
                        <Bell className="w-6 h-6 text-primary" /> Notifikasi
                    </h1>
                    {list.length > 0 && list.some(n => !n.is_read) && (
                        <button onClick={handleMarkAll} className="text-xs font-bold text-primary hover:underline">Tandai semua dibaca</button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
                ) : list.length === 0 ? (
                    <div className="text-center py-20 text-muted bg-white border border-line rounded-3xl shadow-sm">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-bold text-ink">Tidak ada notifikasi</p>
                        <p className="text-xs text-muted mt-1">Seluruh notifikasi aktivitas sewa lapangan akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-line rounded-3xl shadow-sm overflow-hidden divide-y divide-line">
                        {list.map((n) => {
                            const conf = TYPE_CONFIG[n.type] || { icon: <Info className="w-5 h-5 text-primary" />, bg: "bg-blue-50" };
                            return (
                                <div key={n.id} className={`flex items-start gap-4 p-4 transition-colors ${n.is_read ? "" : "bg-primary/5"}`}>
                                    <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${conf.bg}`}>{conf.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-ink leading-snug font-medium">{n.message}</p>
                                        <p className="text-[10px] text-muted mt-1">{new Date(n.createdAt).toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <FooterComponent />
        </div>
    );
}