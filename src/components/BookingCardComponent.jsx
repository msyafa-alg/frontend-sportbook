import StatusBadgeComponent from "./StatusBadgeComponent";
import { MdCalendarToday, MdAccessTime } from "react-icons/md";

export default function BookingCardComponent({ booking, onCancel }) {
    const canCancel = ["pending", "waiting_payment"].includes(booking.status);
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-orange-200 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    {booking.Field?.name || "Lapangan"}
                </span>
                <StatusBadgeComponent status={booking.status} />
            </div>

            <div className="px-4 py-3">
                <div className="flex gap-5 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                        <MdCalendarToday className="text-orange-400" />
                        {booking.booking_date}
                    </span>
                    <span className="flex items-center gap-1">
                        <MdAccessTime className="text-orange-400" />
                        {booking.start_time?.slice(0, 5)} – {booking.end_time?.slice(0, 5)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{booking.Field?.sport_type}</span>
                    <span className="font-bold text-orange-500 text-sm">
                        Rp {booking.total_price?.toLocaleString("id-ID")}
                    </span>
                </div>

                {/* kode pembayaran */}
                {booking.status === "waiting_payment" && booking.Payment && (
                    <div className="mt-3 bg-orange-50 border border-orange-100 rounded px-3 py-2.5">
                        <p className="text-xs text-gray-500 mb-0.5">Kode Pembayaran</p>
                        <p className="font-mono font-bold text-orange-600 text-sm">
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
            </div>
        </div>
    );
}
