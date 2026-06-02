import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FieldCardComponent from "./components/FieldCardComponent";
import LoadingComponent from "./components/LoadingComponent";
import FooterComponent from "./components/FooterComponent";
import { getFieldsService } from "./services/field.service";

export default function App() {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchSport, setSearchSport] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const navigate = useNavigate();

    async function getFields() {
        try {
            const result = await getFieldsService();
            setFields(result.data.slice(0, 8));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    function handleSearch() {
        const params = new URLSearchParams();
        if (searchSport) params.set("sport_type", searchSport);
        if (searchDate) params.set("date", searchDate);
        navigate(`/fields?${params.toString()}`);
    }

    useEffect(() => { getFields(); }, []);

    return (
        <>
            {/* ===== HERO ===== */}
            <div className="bg-[#1a1a2e] text-white py-14 px-6">
                <div className="container mx-auto text-center mb-10">
                    <h1 className="text-3xl font-bold mb-1">
                        Booking <span className="text-orange-400">Lapangan</span> Olahraga terbaik di{" "}
                        <span className="text-orange-400">SportBook</span>
                    </h1>
                </div>

                {/* search bar */}
                <div className="container mx-auto max-w-3xl">
                    <div className="flex flex-col md:flex-row gap-0 bg-white rounded-lg overflow-hidden shadow-lg">
                        <input
                            type="text"
                            placeholder="Pilih atau cari olahraga"
                            value={searchSport}
                            onChange={(e) => setSearchSport(e.target.value)}
                            className="flex-1 px-4 py-3.5 text-gray-700 text-sm focus:outline-none border-r border-gray-100"
                        />
                        <input
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="flex-1 px-4 py-3.5 text-gray-700 text-sm focus:outline-none border-r border-gray-100"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 text-sm transition-colors whitespace-nowrap"
                        >
                            CEK JADWAL
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== REKOMENDASI VENUE ===== */}
            <div className="container mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Rekomendasi <span className="text-orange-500">Venue</span>
                    </h2>
                    <Link to="/fields" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                        Selengkapnya
                    </Link>
                </div>

                {loading ? (
                    <LoadingComponent />
                ) : fields.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p>Belum ada lapangan tersedia</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {fields.map((field) => (
                            <FieldCardComponent key={field.id} field={field} />
                        ))}
                    </div>
                )}
            </div>

            <FooterComponent />
        </>
    );
}
