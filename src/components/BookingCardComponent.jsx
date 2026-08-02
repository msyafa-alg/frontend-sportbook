import StatusBadgeComponent from "./StatusBadgeComponent";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { MdCalendarToday, MdAccessTime } from "react-icons/md";

export default function BookingCardComponent({ booking, onCancel }) {
    const canCancel = ["pending", "waiting_payment"].includes(booking.status);
    const qrData = booking.status === "approved"
        ? JSON.stringify({ id: booking.id, field: booking.Field?.name, date: booking.booking_date, time: `${booking.start_time?.slice(0,5)}-${booking.end_time?.slice(0,5)}` })
        : "";
    return (
        <div id={`ticket-${booking.id}`} className="bg-white border border-line rounded-[18px] overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    {booking.Field?.name || "Lapangan"}
                </span>
                <StatusBadgeComponent status={booking.status} />
            </div>

            <div className="px-4 py-3">
                <div className="flex gap-5 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                        <MdCalendarToday className="text-blue-500" />
                        {booking.booking_date}
                    </span>
                    <span className="flex items-center gap-1">
                        <MdAccessTime className="text-blue-500" />
                        {booking.start_time?.slice(0, 5)} – {booking.end_time?.slice(0, 5)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{booking.Field?.sport_type}</span>
                    <span className="font-bold text-blue-600 text-sm">
                        Rp {booking.total_price?.toLocaleString("id-ID")}
                    </span>
                </div>

                {/* kode pembayaran */}
                {booking.status === "waiting_payment" && booking.Payment && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded px-3 py-2.5">
                        <p className="text-xs text-gray-500 mb-0.5">Kode Pembayaran</p>
                        <p className="font-mono font-bold text-blue-700 text-sm">
                            {booking.Payment.kode_pembayaran}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Expired: {new Date(booking.Payment.expired_at).toLocaleString("id-ID")}
                        </p>
                    </div>
                )}
            {/* tombol batalkan */}
                {canCancel && onCancel && (
                    <div className="mt-3">
                        <button
                            onClick={() => onCancel(booking.id)}
                            className="text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Batalkan Booking
                        </button>
                    </div>
                )}

                {/* e-ticket */}
                {booking.status === "approved" && (
                    <div className="mt-3 rounded-[14px] border border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">E-Ticket</p>
                                <p className="text-xs font-semibold text-ink">#{booking.id}</p>
                            </div>
                            <button onClick={() => window.print()} className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-primary border border-line px-2.5 py-1 rounded-lg">
                                <Printer className="w-3 h-3" /> Print
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <QRCodeSVG value={qrData} size={72} level="M" bgColor="#ffffff" fgColor="#0f172a" />
                            <div className="text-sm">
                                <p className="text-ink font-bold">{booking.Field?.name}</p>
                                <p className="text-muted text-xs mt-0.5">{booking.booking_date} • {booking.start_time?.slice(0,5)}–{booking.end_time?.slice(0,5)}</p>
                                <p className="text-primary font-extrabold mt-1.5">Rp {booking.total_price?.toLocaleString("id-ID")}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
