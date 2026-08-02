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

export default function Privacy() {
    useSeo("Kebijakan Privasi", "Kebijakan privasi SportBook mengenai data pengguna, keamanan informasi, dan penggunaan layanan.");

    return (
        <LegalLayout hero="Kebijakan Privasi" kicker="Legal" title="Kebijakan Privasi"
            subtitle="Kami menghargai privasimu dan berkomitmen melindungi data pribadi yang kamu berikan.">
            <Block title="1. Data yang Kami Kumpulkan">
                <p>Kami mengumpulkan data yang kamu berikan saat daftar dan memesan, antara lain nama, username, email (opsional), dan riwayat pemesanan.</p>
            </Block>
            <Block title="2. Penggunaan Data">
                <p>Data digunakan untuk memproses pemesanan, mengirim konfirmasi, meningkatkan layanan, dan memberikan informasi promo yang relevan.</p>
            </Block>
            <Block title="3. Keamanan">
                <p>Kata sandi disimpan dalam bentuk terenkripsi. Kami menerapkan langkah keamanan untuk melindungi data dari akses yang tidak sah.</p>
            </Block>
            <Block title="4. Cookie">
                <p>Kami menggunakan cookie untuk menjaga sesi login dan meningkatkan pengalaman penggunaan platform.</p>
            </Block>
            <Block title="5. Berbagi Data">
                <p>Kami tidak menjual data pribadimu kepada pihak ketiga. Data hanya dibagikan untuk memenuhi keperluan pemrosesan pemesanan.</p>
            </Block>
            <Block title="6. Hak Pengguna">
                <p>Kamu dapat memperbarui atau menghapus informasimu melalui menu Profil, atau menghubungi kami untuk pertanyaan lebih lanjut.</p>
            </Block>
        </LegalLayout>
    );
}