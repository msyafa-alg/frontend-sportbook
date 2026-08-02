import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { getNotificationsService, readAllNotificationsService } from "../services/notification.service";

const TYPE_ICON = {
    approved: "bg-emerald-100 text-emerald-600",
    rejected: "bg-red-100 text-red-500",
    payment_paid: "bg-blue-100 text-blue-600",
    booking_created: "bg-sky-100 text-sky-600",
    cancelled: "bg-slate-200 text-slate-600",
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);
    const [unread, setUnread] = useState(0);
    const ref = useRef(null);

    async function fetchAll() {
        try {
            const r = await getNotificationsService({ limit: 15 });
            setList(r.data.list);
            setUnread(r.data.unread);
        } catch (e) { /* ignore */ }
    }

    async function markRead() {
        await readAllNotificationsService();
        setUnread(0);
        setList((l) => l.map((n) => ({ ...n, is_read: true })));
    }

    useEffect(() => {
        fetchAll();
        const id = setInterval(fetchAll, 20000);
        return () => clearInterval(id);
    }, []);

    // tutup saat klik di luar
    useEffect(() => {
        function onDoc(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="relative w-10 h-10 grid place-items-center rounded-full border border-line hover:border-primary/40 hover:shadow-md transition-all text-ink"
            >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-ink/10 border border-line overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                            <p className="font-bold text-sm text-ink">Notifikasi</p>
                            {list.length > 0 && (
                                <button onClick={markRead} className="text-xs font-semibold text-primary hover:underline">Tandai dibaca</button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {list.length === 0 ? (
                                <div className="px-4 py-10 text-center text-sm text-muted">Belum ada notifikasi</div>
                            ) : list.map((n) => (
                                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-line/60 ${n.is_read ? "bg-white" : "bg-primary/5"}`}>
                                    <span className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${TYPE_ICON[n.type] || "bg-slate-100 text-slate-500"}`}>
                                        <span className="text-[11px] font-bold">{n.type?.charAt(0).toUpperCase()}</span>
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm text-ink leading-snug">{n.message}</p>
                                        <p className="text-[11px] text-muted mt-0.5">{new Date(n.createdAt).toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}