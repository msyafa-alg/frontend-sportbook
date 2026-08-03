import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "./context/AuthContext";
import FieldCardComponent from "./components/FieldCardComponent";
import FooterComponent from "./components/FooterComponent";
import { SkeletonCard, EmptyState } from "./components/ui/State";
import { getFieldsService } from "./services/field.service";
import {
    Search, CalendarDays, ChevronRight, Quote,
    Volleyball, Disc, Trophy, Target, Award, Zap,
    ShieldCheck, CalendarCheck, ArrowRight,
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop";

const CATEGORIES = [
    { name: "Futsal", icon: Trophy },
    { name: "Badminton", icon: Target },
    { name: "Basket", icon: Disc },
    { name: "Voli", icon: Volleyball },
    { name: "Golf", icon: Zap },
    { name: "Lainnya", icon: Award },
];

const STATS = [
    { value: "250+", label: "Venue" },
    { value: "15K+", label: "Booking" },
    { value: "4.9", label: "Rating" },
    { value: "50+", label: "Partner" },
];

const TESTIMONIALS = [
    { name: "Andi Pratama", role: "Kapiten Futsal", text: "Booking jadi gampang banget, slot-nya langsung kelihatan. Harga jelas, lapangan sesuai foto! Sangat direkomendasikan." },
    { name: "Sari Dewi", role: "Pemain Bulu Tangkis", text: "Simpel dan cepat. Semakin sering main jadi makin sering karena jadwalnya fleksibel. Top!" },
    { name: "Rizky Ramadhan", role: "Pebasket", text: "Awalnya ragu, tapi ternyata proses pembayaran & konfirmasinya super ngebut. Terbaik di kotanya." },
];

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function App() {
    const { isLogin } = useContext(AuthContext);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sport, setSport] = useState("");
    const [date, setDate] = useState("");
    const [t, setT] = useState(0);
    const navigate = useNavigate();

    async function getFields() {
        try {
            const r = await getFieldsService();
            setFields(r.data.slice(0, 6));
        } catch (e) {
            setFields([]);
        } finally {
            setLoading(false);
        }
    }

    function doSearch(e) {
        e.preventDefault();
        const p = new URLSearchParams();
        if (sport) p.set("sport_type", sport);
        navigate(`/fields?${p.toString()}`);
    }

    function goCategory(name) {
        navigate(`/fields?sport_type=${encodeURIComponent(name)}`);
    }

    useEffect(() => { getFields(); }, []);

    return (
        <>
            {/* ===== HERO ===== */}
            <section className="relative min-h-[88vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 py-16 text-white">
                    <motion.div initial="hidden" animate="show" variants={fadeUp}>
                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold">
                            <Zap className="w-3.5 h-3.5 text-sky-300" /> #1 Booking Lapangan Terpercaya
                        </span>
                        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] max-w-2xl">
                            Temukan &amp; Pesan Lapangan <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">Favoritmu</span>
                        </h1>
                        <p className="mt-5 text-white/80 text-lg max-w-xl">
                            Proses cepat, lapangan terjamin, main jadi asyik. Booking kapan saja dalam hitungan menit.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                        className="mt-10 max-w-3xl"
                    >
                        <form onSubmit={doSearch} className="bg-white rounded-2xl p-2 shadow-2xl shadow-ink/30 grid sm:grid-cols-[1fr_1fr_auto] gap-2">
                            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-text">
                                <Search className="w-5 h-5 text-primary shrink-0" />
                                <span className="flex-1 min-w-0">
                                    <span className="block text-[11px] font-bold text-muted uppercase tracking-wide">Olahraga</span>
                                    <input
                                        value={sport}
                                        onChange={(e) => setSport(e.target.value)}
                                        placeholder="Futsal, Badminton, Basket..."
                                        className="w-full bg-transparent text-ink text-sm font-medium outline-none"
                                    />
                                </span>
                            </label>
                            <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                <CalendarDays className="w-5 h-5 text-primary shrink-0" />
                                <span className="flex-1 min-w-0">
                                    <span className="block text-[11px] font-bold text-muted uppercase tracking-wide">Tanggal</span>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent text-ink text-sm font-medium outline-none" />
                                </span>
                            </label>
                            <button type="submit" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                                Cari <ChevronRight className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="mt-3 text-white/70 text-sm flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% aman &amp; transparan, tanpa biaya tersembunyi.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== KATEGORI ===== */}
            <section className="container mx-auto px-4 sm:px-6 py-14">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-8">
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Jelajahi</span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink">Kategori Olahraga</h2>
                </motion.div>

                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                    className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {CATEGORIES.map((c) => {
                        const Icon = c.icon;
                        return (
                            <motion.button key={c.name} variants={fadeUp} onClick={() => goCategory(c.name)}
                                className="group flex flex-col items-center gap-3 bg-card border border-line rounded-2xl py-6 hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                                <span className="w-12 h-12 rounded-2xl bg-canvas group-hover:bg-primary group-hover:text-white grid place-items-center text-primary transition-colors">
                                    <Icon className="w-6 h-6" />
                                </span>
                                <span className="text-sm font-semibold text-ink">{c.name}</span>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </section>

            {/* ===== VENUE POPULER ===== */}
            <section className="container mx-auto px-4 sm:px-6 pb-14">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Populer</span>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink">Lapangan Favorit</h2>
                    </div>
                    <Link to="/fields" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                        Lihat semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : fields.length === 0 ? (
                    <EmptyState title="Belum ada lapangan tersedia" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fields.map((f, i) => <FieldCardComponent key={f.id} field={f} index={i} />)}
                    </div>
                )}
            </section>

            {/* ===== STATISTIK ===== */}
            <section className="bg-ink text-white">
                <div className="container mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                    {STATS.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                            <p className="text-3xl sm:text-4xl font-extrabold text-sky-300">{s.value}</p>
                            <p className="mt-1 text-sm text-white/70">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== CARA PESAN ===== */}
            <section className="container mx-auto px-4 sm:px-6 py-16">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-12">
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Cara Pesan</span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink">Mulai Main dalam 3 Langkah</h2>
                </motion.div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        { icon: Search, t: "Cari Lapangan", d: "Filter berdasarkan lokasi dan jenis olahraga yang kamu suka." },
                        { icon: CalendarCheck, t: "Pilih Jadwal", d: "Pilih slot waktu yang tersedia dengan mudah dan instan.", hi: true },
                        { icon: ShieldCheck, t: "Bayar Aman", d: "Selesaikan pembayaran dan dapatkan konfirmasi langsung." },
                    ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div key={s.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={`rounded-[20px] p-8 ${s.hi ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/20" : "bg-card border border-line shadow-sm"}`}>
                                <div className={`w-14 h-14 rounded-2xl grid place-items-center mb-6 ${s.hi ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${s.hi ? "text-white" : "text-ink"}`}>{s.t}</h3>
                                <p className={`text-sm leading-relaxed ${s.hi ? "text-white/85" : "text-muted"}`}>{s.d}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ===== TESTIMONI ===== */}
            <section className="bg-canvas border-y border-line py-16">
                <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Testimoni</span>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink">Kata Mereka</h2>
                    </motion.div>

                    <div className="mt-10 relative bg-card border border-line rounded-[20px] p-8 shadow-sm min-h-[200px]">
                        <Quote className="w-10 h-10 text-primary/20 mx-auto mb-4" />
                        <AnimatePresence mode="wait">
                            <motion.div key={t} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                                <p className="text-lg text-ink/90 leading-relaxed">“{TESTIMONIALS[t].text}”</p>
                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-primary text-white grid place-items-center font-bold">
                                        {TESTIMONIALS[t].name.charAt(0)}
                                    </span>
                                    <div className="text-left">
                                        <p className="font-bold text-ink">{TESTIMONIALS[t].name}</p>
                                        <p className="text-sm text-muted">{TESTIMONIALS[t].role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-6 flex justify-center gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button key={i} onClick={() => setT(i)} className={`h-2.5 rounded-full transition-all ${i === t ? "w-8 bg-primary" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="container mx-auto px-4 sm:px-6 py-16">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                    className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-[#1d4ed8] px-8 py-14 sm:px-14 text-center text-white">
                    <div className="absolute -top-10 -right-6 text-white/10"><Disc size={220} /></div>
                    <div className="absolute -bottom-12 -left-8 text-white/10"><Volleyball size={200} /></div>
                    <div className="relative">
                        <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">Siap Main? <br /> {isLogin ? "Pesan Lapangan Favoritmu Sekarang!" : "Pesan Sekarang &amp; Dapatkan Diskon!"}</h2>
                        <p className="mt-4 text-white/85 max-w-xl mx-auto">{isLogin ? "Pilih lapangan, tentukan jadwal, dan langsung main." : "Daftar hari ini dan nikmati promo spesial untuk pemesanan pertamamu."}</p>
                        <Link to={isLogin ? "/fields" : "/register"} className="mt-8 inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-full shadow-xl hover:bg-slate-50 hover:-translate-y-0.5 transition-all">
                            {isLogin ? "Cari Lapangan" : "Daftar Sekarang"} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            <FooterComponent />
        </>
    );
}