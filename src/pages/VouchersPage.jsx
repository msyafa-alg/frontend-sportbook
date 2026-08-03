import { useState, useEffect } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { getActiveVouchersService } from "../services/stats.service";
import { useSeo } from "../utils/seo";
import FooterComponent from "../components/FooterComponent";
import { Ticket, Clock, Zap } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function VouchersPage() {
    useSeo("Promo & Voucher", "Daftar kode promo dan voucher diskon booking lapangan di SportBook.");
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    async function load() {
        try {
            const r = await getActiveVouchersService();
            setVouchers(r.data || []);
        } catch (e) {
            toast.error("Gagal memuat voucher promo.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    return (
        <div className="bg-canvas min-h-screen flex flex-col">
            <div className="container mx-auto px-4 sm:px-6 py-8 flex-1 max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-primary" /> Promo &amp; Voucher
                    </h1>
                    <p className="text-sm text-muted mt-1">Gunakan kode voucher berikut saat melakukan booking untuk menikmati potongan harga.</p>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 gap-4">{[0, 1].map(i => <div key={i} className="skeleton h-32 rounded-3xl" />)}</div>
                ) : vouchers.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-line rounded-3xl shadow-sm text-muted">
                        <Ticket className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-bold text-ink">Tidak ada promo aktif</p>
                        <p className="text-xs mt-1">Nantikan terus promo menarik dari SportBook.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {vouchers.map((v) => (
                            <div key={v.code} className="bg-white border border-line rounded-3xl shadow-sm overflow-hidden p-6 relative">
                                <div className="absolute -top-3 -right-3 text-primary/5"><Ticket size={100} /></div>
                                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3">
                                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> {v.discount_type === 'percent' ? "Diskon Persen" : "Diskon Nominal"}
                                </span>
                                <h3 className="text-2xl font-extrabold text-ink">{v.code}</h3>
                                <p className="text-sm text-muted mt-1">Potongan {v.discount_type === 'percent' ? `${v.discount_value}%` : `Rp ${v.discount_value.toLocaleString("id-ID")}`}</p>
                                {v.min_order > 0 && <p className="text-xs text-muted/80 mt-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Min. transaksi Rp {v.min_order.toLocaleString("id-ID")}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <FooterComponent />
        </div>
    );
}