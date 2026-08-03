import { useState, useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { getAdminStatsService } from "../../services/stats.service";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { CalendarCheck, ShieldAlert, Award, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const r = await getAdminStatsService();
            setStats(r.data);
        } catch (e) {
            // handle error
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    if (loading || !stats) return <LoadingComponent />;

    const cards = [
        { label: "Total Booking", value: stats.statCards.totalBookings, icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
        { label: "Booking Disetujui", value: stats.statCards.approved, icon: Award, color: "text-emerald-600 bg-emerald-50" },
        { label: "Total Pendapatan", value: `Rp ${stats.statCards.revenue?.toLocaleString("id-ID")}`, icon: DollarSign, color: "text-indigo-600 bg-indigo-50" },
        { label: "User Aktif", value: stats.statCards.totalUsers, icon: ShieldAlert, color: "text-amber-600 bg-amber-50" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-primary rounded-2xl p-6 text-white flex justify-between items-center shadow-lg shadow-primary/25">
                <div>
                    <h1 className="text-xl font-bold">Ringkasan Sistem</h1>
                    <p className="text-blue-100 text-xs mt-0.5">Analisis pendapatan &amp; total transaksi booking lapangan.</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div key={c.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs text-gray-500 font-semibold uppercase">{c.label}</span>
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.color}`}><Icon className="w-4 h-4" /></span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-primary" /> Tren Booking (7 Hari Terakhir)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                                <YAxis stroke="#94a3b8" fontSize={11} />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" name="Jumlah" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Venues */}
                <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-1.5"><ArrowUpRight className="w-4 h-4 text-primary" /> Top Venue</h3>
                    <div className="h-64">
                        {stats.topVenues.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400">Belum ada data transaksi</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topVenues} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                                    <Tooltip />
                                    <Bar dataKey="count" name="Total Booking" fill="#2563eb" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}