import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FieldCardComponent from "../components/FieldCardComponent";
import LoadingComponent from "../components/LoadingComponent";
import FooterComponent from "../components/FooterComponent";
import { getFieldsService } from "../services/field.service";
import { HiSearch, HiSelector } from "react-icons/hi";

const SORT_OPTIONS = [
    { value: "", label: "Urutkan" },
    { value: "az", label: "Nama A - Z" },
    { value: "za", label: "Nama Z - A" },
    { value: "termurah", label: "Harga Termurah" },
    { value: "termahal", label: "Harga Termahal" },
];

export default function Fields() {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [searchParams] = useSearchParams();

    async function getFields(name = "") {
        try {
            const result = await getFieldsService(name ? { name } : {});
            setFields(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    function processSearch(e) {
        const val = e.target.value;
        setSearch(val);
        getFields(val);
    }

    // sort dilakukan di frontend, tidak perlu request ulang ke backend
    function getSortedFields() {
        const sorted = [...fields];
        if (sortBy === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortBy === "termurah") sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
        else if (sortBy === "termahal") sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
        return sorted;
    }

    useEffect(() => {
        const sport = searchParams.get("sport_type") || "";
        setSearch(sport);
        getFields(sport);
    }, []);

    const displayedFields = getSortedFields();

    // daftar kategori olahraga unik dari data lapangan
    const categories = [...new Set(fields.map((f) => f.sport_type).filter(Boolean))];

    function applyCategory(sport) {
        const val = sport === search ? "" : sport;
        setSearch(val);
        getFields(val);
    }

    return (
        <>
            {/* sub-header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
                <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h1 className="text-lg font-bold text-gray-900">
                        Semua <span className="text-blue-600">Venue</span>
                    </h1>

                    <div className="flex gap-2 w-full md:w-auto">
                        {/* search */}
                        <div className="relative flex-1 md:w-64">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama lapangan..."
                                value={search}
                                onChange={processSearch}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                        </div>

                        {/* sort dropdown */}
                        <div className="relative">
                            <HiSelector className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 appearance-none cursor-pointer"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {loading ? (
                    <LoadingComponent />
                ) : displayedFields.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-base font-medium">Lapangan tidak ditemukan</p>
                        <p className="text-sm mt-1">Coba kata kunci yang berbeda</p>
                    </div>
                ) : (
                    <>
                        {/* filter kategori */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => applyCategory(cat)}
                                        className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                                            search === cat
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-gray-400 mb-5">{displayedFields.length} venue ditemukan</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {displayedFields.map((field) => (
                                <FieldCardComponent key={field.id} field={field} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <FooterComponent />
        </>
    );
}
