import { useSeo } from "../utils/seo";
import LegalLayout from "../components/LegalLayout";

function Block({ title, children }) {
    return (
        <section className="mb-10">
            <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary grid place-items-center text-sm font-extrabold">•</span>
                {title}
            </h2>
            <div className="text-muted text-[15px] leading-relaxed space-y-2">{children}</div>
        </section>
    );
}

export default function Terms() {
    useSeo("Syarat & Ketentuan", "Syarat dan ketentuan penggunaan platform SportBook untuk booking lapangan olahraga online.");

    return (
        <LegalLayout hero="Syarat & Ketentuan" kicker="Legal" title="Syarat & Ketentuan"
            subtitle="Dengan menggunakan layanan SportBook, kamu menyetujui syarat dan ketentuan berikut.">
            <Block title="1. Layanan Kami">
                <p>SportBook adalah platform yang mempertemukan pengguna dengan penyedia lapangan olahraga untuk melakukan reservasi secara online.</p>
            </Block>
            <Block title="2. Pemesanan & Pembayaran">
                <p>Total pembayaran dihitung berdasarkan durasi sewa dan tarif per jam lapangan yang dipilih. Pembayaran harus diselesaikan dalam batas waktu yang ditentukan; jika tidak, reservasi akan otomatis dibatalkan.</p>
            </Block>
            <Block title="3. Pembatalan & Pengubahan Jadwal">
                <p>Reservasi yang belum dibayar dapat dibatalkan atau diubah jadwalnya. Setelah status pembayaran terkonfirmasi dan disetujui penyedia, kebijakan pembatalan tunduk pada aturan penyedia lapangan.</p>
            </Block>
            <Block title="4. Tanggung Jawab Pengguna">
                <p>Pengguna bertanggung jawab atas ketepatan data pemesanan, menghormati jadwal, dan menjaga fasilitas lapangan selama digunakan.</p>
            </Block>
            <Block title="5. Perubahan Ketentuan">
                <p>Kami dapat memperbarui ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak tanggal diperbarui dan dipublikasikan di halaman ini.</p>
            </Block>
            <Block title="6. Hubungi Kami">
                <p>Pertanyaan terkait ketentuan dapat dialihkan ke tim melalui halaman Kontak pada footer kami.</p>
            </Block>
        </LegalLayout>
    );
}