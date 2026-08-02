import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import { useSeo } from "../utils/seo";
import LegalLayout from "../components/LegalLayout";

const FAQS = [
    { q: "Bagaimana cara memesan lapangan?", a: "Pilih lapangan yang kamu inginkan, klik tombol Booking, tentukan tanggal dan jam yang tersedia, lalu selesaikan pembayaran menggunakan kode yang diberikan." },
    { q: "Apakah saya bisa membatalkan booking?", a: "Ya. Booking dengan status belum dibayar dapat dibatalkan atau diubah jadwalnya dari halaman Riwayat Booking." },
    { q: "Berapa lama waktu pembayaran?", a: "Pembayaran harus diselesaikan dalam batas waktu yang ditentukan pada halaman struk (biasanya 1 jam setelah pemesanan) sebelum booking otomatis dibatalkan." },
    { q: "Bagaimana saya mendapat konfirmasi?", a: "Setelah pembayaran, admin akan memverifikasi dan mengonfirmasi status booking kamu menjadi 'Disetujui'." },
    { q: "Metode pembayaran apa saja yang tersedia?", a: "Saat ini kami menyediakan simulasi pembayaran lewat kode. Integrasi pembayaran otomatis sedang dalam pengembangan." },
    { q: "Apakah ada biaya tersembunyi?", a: "Tidak. Harga yang ditampilkan sudah mencakup sewa lapangan. Tanpa biaya tambahan tersembunyi." },
];

function Item({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-semibold text-ink text-[15px]">{q}</span>
                <ChevronDown className={`w-5 h-5 text-muted transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Faq() {
    useSeo("Pusat Bantuan", "Pertanyaan umum dan panduan seputar booking lapangan di SportBook.");

    return (
        <LegalLayout hero="Pusat Bantuan" kicker="Bantuan" title="Pusat Bantuan"
            subtitle="Temukan jawaban atas pertanyaan paling umum kamu tentang SportBook.">
            <div className="space-y-3 mb-10">
                {FAQS.map((f, i) => <Item key={i} q={f.q} a={f.a} />)}
            </div>

            <div className="rounded-[20px] bg-ink text-white p-8 text-center">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-extrabold mb-1">Masih bingung?</h3>
                <p className="text-white/70 text-sm mb-6">Tim kami siap membantu kamu.</p>
                <a href="mailto:halo@sportbook.id" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full hover:-translate-y-0.5 transition-transform">
                    <Mail className="w-4 h-4" /> Hubungi Kami
                </a>
            </div>
        </LegalLayout>
    );
}