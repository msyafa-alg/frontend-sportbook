import { Link } from "react-router-dom";
import { useSeo } from "../utils/seo";
import LegalLayout from "../components/LegalLayout";
import { motion } from "framer-motion";
import { Trophy, Target, ShieldCheck, ArrowRight } from "lucide-react";

const VALUES = [
    { icon: Trophy, t: "Kualitas", d: "Hanya bekerja sama dengan venue terbaik dan terverifikasi." },
    { icon: Target, t: "Kemudahan", d: "Memesan lapangan sesederhana beberapa klik saja." },
    { icon: ShieldCheck, t: "Kepercayaan", d: "Transaksi aman, jadwal transparan, tanpa biaya tersembunyi." },
];

export default function About() {
    useSeo("Tentang Kami", "Kenali SportBook, platform booking lapangan olahraga online yang cepat, aman dan terpercaya.");

    return (
        <LegalLayout hero="Tentang Kami" kicker="Perusahaan" title="Bermain Lebih Sering, Lebih Mudah"
            subtitle="SportBook lahir dari masalah sederhana: mencari & memesan lapangan olahraga sering kali merepotkan.">
            <p className="text-muted text-lg leading-relaxed mb-10">
                Kami menghubungkan para pecinta olahraga dengan lapangan-lapangan terbaik di kotamu
                — transparan dari segi harga, jelas dari segi jadwal, dan dapat dipesan hanya dalam
                hitungan menit.
            </p>

            <h2 className="text-xl font-bold text-ink mb-5">Nilai yang Kami Pegang</h2>
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
                {VALUES.map((v, i) => {
                    const Icon = v.icon;
                    return (
                        <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="bg-card border border-line rounded-2xl p-6 shadow-sm">
                            <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4"><Icon className="w-5 h-5" /></span>
                            <h3 className="font-bold text-ink mb-1">{v.title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{v.d}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="rounded-[20px] bg-gradient-to-br from-primary to-primary-dark text-white p-8 text-center">
                <h3 className="text-xl font-extrabold mb-2">Siap Mulai Bareng Kami?</h3>
                <p className="text-white/80 text-sm mb-6">Temukan lapangan favoritmu dan langsung booking sekarang.</p>
                <Link to="/fields" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3 rounded-full hover:-translate-y-0.5 transition-transform">
                    Jelajahi Venue <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </LegalLayout>
    );
}