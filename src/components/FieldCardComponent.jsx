import { Link } from "react-router-dom";

export default function FieldCardComponent({ field }) {
    return (
        <Link to={`/fields/${field.id}`} className="block group">
            {/* gambar */}
            <div className="overflow-hidden rounded-lg mb-3 aspect-[4/3] bg-gray-100">
                <img
                    src={field.image || "https://placehold.co/400x300/f3f4f6/9ca3af?text=Lapangan"}
                    alt={field.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* info */}
            <div>
                <h5 className="font-bold text-gray-900 text-sm uppercase tracking-wide leading-tight mb-0.5">
                    {field.name}
                </h5>
                <p className="text-xs text-gray-500 mb-0.5">
                    {field.sport_type} &middot;{" "}
                    <span className="text-orange-500 font-semibold">1 Lapangan</span>
                </p>
                <p className="text-xs text-gray-500">
                    Harga mulai{" "}
                    <span className="text-orange-500 font-semibold">
                        Rp {field.price_per_hour?.toLocaleString("id-ID")}
                    </span>
                </p>
            </div>
        </Link>
    );
}
