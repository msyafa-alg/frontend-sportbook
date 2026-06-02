// StatusBadgeComponent : menampilkan badge status booking dengan warna berbeda
// pakai span biasa agar tidak bergantung pada flowbite sub-component
export default function StatusBadgeComponent({ status }) {
    const styleMap = {
        pending:         "bg-gray-100 text-gray-600",
        waiting_payment: "bg-purple-100 text-purple-700",
        paid:            "bg-blue-100 text-blue-700",
        approved:        "bg-green-100 text-green-700",
        rejected:        "bg-red-100 text-red-600",
    };

    const labelMap = {
        pending:         "Pending",
        waiting_payment: "Menunggu Bayar",
        paid:            "Sudah Bayar",
        approved:        "Disetujui",
        rejected:        "Ditolak",
    };

    const style = styleMap[status] || "bg-gray-100 text-gray-600";
    const label = labelMap[status] || status;

    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
            {label}
        </span>
    );
}
