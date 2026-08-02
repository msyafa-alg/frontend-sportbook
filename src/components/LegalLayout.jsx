import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function LegalLayout({ hero, kicker, title, subtitle, children }) {
    return (
        <div className="bg-canvas min-h-screen">
            {/* banner */}
            <div className="bg-ink text-white">
                <div className="container mx-auto px-4 sm:px-6 py-12">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0, y: 18 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                        }}
                    >
                        <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
                            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-white/90">{hero}</span>
                        </nav>
                        {kicker && <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{kicker}</p>}
                        <h1 className="text-3xl sm:text-4xl font-extrabold">{title}</h1>
                        {subtitle && <p className="mt-3 text-white/70 max-w-2xl">{subtitle}</p>}
                    </motion.div>
                </div>
            </div>

            {/* konten */}
            <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">{children}</div>
        </div>
    );
}