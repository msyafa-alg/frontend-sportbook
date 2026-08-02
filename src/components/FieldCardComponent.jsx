import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, ChevronRight, Radio } from "lucide-react";

function rating(id) {
    const base = [4.8, 4.9, 4.7, 4.6, 5.0, 4.4];
    return base[Number(id) % base.length].toFixed(1);
}

export default function FieldCardComponent({ field, index = 0 }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="group bg-card rounded-[20px] border border-line overflow-hidden shadow-sm hover:shadow-[0_20px_50px_-18px_rgba(15,23,42,0.25)] transition-shadow"
        >
            {/* gambar */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={field.image || "https://placehold.co/600x450/f1f5f9/94a3b8?text=Lapangan"}
                    alt={field.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* rating */}
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-ink shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rating(field.id)}
                </span>
            </div>

            {/* konten */}
            <div className="p-4">
                <div className="flex items-center gap-1 text-xs font-medium text-muted mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary" /> {field.sport_type}
                    <span className="text-line">•</span>
                    <Radio className="w-3.5 h-3.5 text-primary" /> 1 Lapangan
                </div>

                <h3 className="font-bold text-ink text-base leading-snug mb-3 line-clamp-1">{field.name}</h3>

                {/* harga + tombol */}
                <div className="flex items-end justify-between gap-2 pt-3 border-t border-line">
                    <div>
                        <p className="text-[11px] text-muted">Mulai dari</p>
                        <p className="font-extrabold text-primary text-lg leading-none">Rp {field.price_per_hour?.toLocaleString("id-ID")}
                            <span className="text-sm font-semibold text-muted">/jam</span>
                        </p>
                    </div>
                    <Link
                        to={`/fields/${field.id}`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white bg-primary hover:bg-primary-dark px-4 py-2.5 rounded-full shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
                    >
                        Booking <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}