import { useState, useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { getAllPaymentsService } from "../../services/payment.service";
import { MdCreditCard } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import { exportToExcel } from "../../utils/exportExcel";

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    async function getPayments(p = 1) {
        setLoading(true);
        try {
            const result = await getAllPaymentsService({ page: p, limit: 10 });
            setPayments(result.data.data);
            setTotalPage(result.data.totalPage);
            setPage(p);
        } catch (error) { } finally { setLoading(false); }
    }

    useEffect(() => { getPayments(); }, []);

    function handleExport() {
        const data = payments.map((p) => ({
            "Kode Pembayaran": p.kode_pembayaran,
            "Lapangan": p.Booking?.Field?.name || "-",
            "Total Harga (Rp)": p.total_harga,
            "Status": p.status === "paid" ? "Sudah Bayar" : "Belum Bayar",
            "Expired At": new Date(p.expired_at).toLocaleString("id-ID"),
        }));
        exportToExcel(data, "Data_Pembayaran", "Pembayaran");
    }

    if (loading) return <LoadingComponent />;

    return (
        <div>
            <div className="mb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Manajemen Pembayaran</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{payments.length} total transaksi</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <HiDownload /> Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {["Kode Pembayaran", "Lapangan", "Total Harga", "Status", "Expired At"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-400">
                                        <MdCreditCard className="text-3xl mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Belum ada transaksi</p>
                                    </td>
                                </tr>
                            ) : payments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-700">
                                        {p.kode_pembayaran}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600">{p.Booking?.Field?.name || "-"}</td>
                                    <td className="px-5 py-3.5 font-semibold text-blue-600">
                                        Rp {p.total_harga?.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                            p.status === "paid"
                                                ? "bg-green-50 text-green-600"
                                                : "bg-yellow-50 text-yellow-600"
                                        }`}>
                                            {p.status === "paid" ? "Sudah Bayar" : "Belum Bayar"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                                        {new Date(p.expired_at).toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPage > 1 && (
                <div className="flex items-center gap-2 mt-4">
                    <button disabled={page <= 1} onClick={() => getPayments(page - 1)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                    <span className="text-xs text-gray-500">Halaman {page} / {totalPage}</span>
                    <button disabled={page >= totalPage} onClick={() => getPayments(page + 1)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
            )}
        </div>
    );
}
