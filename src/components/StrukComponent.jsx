import { MdSportsSoccer, MdClose, MdPrint } from "react-icons/md";

// StrukComponent : struk sederhana setelah booking berhasil
// props:
//   booking : data booking dari API
//   onClose : fungsi untuk tutup struk
export default function StrukComponent({ booking, onClose }) {
    if (!booking) return null;

    function handlePrint() {
        window.print();
    }

    return (
        // overlay background
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white w-full max-w-sm rounded-lg overflow-hidden shadow-2xl">

                {/* tombol tutup & print (tidak ikut terprint) */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100 print:hidden">
                    <span className="text-sm font-semibold text-gray-700">Struk Booking</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1 text-xs text-orange-500 border border-orange-200 px-3 py-1.5 rounded hover:bg-orange-50 transition-colors"
                        >
                            <MdPrint /> Print
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <MdClose />
                        </button>
                    </div>
                </div>

                {/* isi struk */}
                <div className="p-5" id="struk-print">
                    {/* header */}
                    <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300">
                        <div className="flex justify-center mb-2">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <MdSportsSoccer className="text-white text-xl" />
                            </div>
                        </div>
                        <h2 className="font-bold text-gray-900 text-lg">SportBook</h2>
                        <p className="text-xs text-gray-500">Booking Lapangan Olahraga</p>
                    </div>

                    {/* detail booking */}
                    <div className="space-y-2.5 text-sm mb-4">
                        <Row label="No. Booking" value={`#${booking.id}`} />
                        <Row label="Lapangan" value={booking.Field?.name || "-"} />
                        <Row label="Jenis" value={booking.Field?.sport_type || "-"} />
                        <Row label="Tanggal" value={booking.booking_date} />
                        <Row label="Jam" value={`${booking.start_time?.slice(0,5)} - ${booking.end_time?.slice(0,5)}`} />
                    </div>

                    {/* garis pembatas */}
                    <div className="border-t border-dashed border-gray-300 my-3" />

                    {/* total */}
                    <div className="flex justify-between items-center font-bold text-base">
                        <span className="text-gray-700">Total</span>
                        <span className="text-orange-500">
                            Rp {booking.total_price?.toLocaleString("id-ID")}
                        </span>
                    </div>

                    {/* kode pembayaran */}
                    {booking.Payment && (
                        <div className="mt-3 bg-orange-50 border border-orange-100 rounded p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Kode Pembayaran</p>
                            <p className="font-mono font-bold text-orange-600 text-base tracking-widest">
                                {booking.Payment.kode_pembayaran}
                            </p>
                            {booking.Payment.expired_at && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Bayar sebelum: {new Date(booking.Payment.expired_at).toLocaleString("id-ID")}
                                </p>
                            )}
                        </div>
                    )}

                    {/* status */}
                    <div className="mt-3 text-center">
                        <span className="text-xs text-gray-400">Status: </span>
                        <span className="text-xs font-semibold text-orange-500 uppercase">
                            {booking.status}
                        </span>
                    </div>

                    {/* footer struk */}
                    <div className="border-t border-dashed border-gray-300 mt-4 pt-3 text-center">
                        <p className="text-xs text-gray-400">Terima kasih telah menggunakan SportBook</p>
                        <p className="text-xs text-gray-400">Simpan kode pembayaran untuk melakukan pembayaran</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// komponen baris label-value untuk struk
function Row({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-2">
            <span className="text-gray-500 shrink-0">{label}</span>
            <span className="font-medium text-gray-900 text-right">{value}</span>
        </div>
    );
}
