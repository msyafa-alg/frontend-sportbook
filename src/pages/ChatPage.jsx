import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { Send, Headset } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import FooterComponent from "../components/FooterComponent";
import { useSeo } from "../utils/seo";
import { getMyChatService, sendChatService } from "../services/chat.service";

export default function ChatPage() {
    useSeo("Pesan Admin", "Pusat bantuan via chat dengan admin SportBook.");
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    async function load() {
        try {
            const r = await getMyChatService();
            setMessages(r.data.messages);
        } catch (e) { /* ignore */ }
        finally { setLoading(false); }
    }

    async function send(e) {
        e.preventDefault();
        if (!text.trim() || sending) return;
        setSending(true);
        try {
            await sendChatService(text.trim());
            setText("");
            await load();
        } finally { setSending(false); }
    }

    useEffect(() => { load(); const id = setInterval(load, 4000); return () => clearInterval(id); }, []);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    return (
        <div className="bg-canvas min-h-screen flex flex-col">
            <div className="container mx-auto px-4 sm:px-6 py-8 flex-1 max-w-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Headset className="w-6 h-6" /></div>
                    <div>
                        <h1 className="text-xl font-extrabold text-ink">Hubungi Admin</h1>
                        <p className="text-sm text-muted">Tanyakan status booking atau apa pun, admin kami siap membantu.</p>
                    </div>
                </div>

                <div className="flex-1 bg-card border border-line rounded-[20px] flex flex-col shadow-sm overflow-hidden">
                    {/* pesan */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[50vh] max-h-[60vh]">
                        {loading ? (
                            <div className="space-y-3">{[0,1].map(i => <div key={i} className="skeleton h-10 w-2/3 rounded-2xl" />)}</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-muted py-16 text-sm">Belum ada pesan. Mulai percakapan 👇</div>
                        ) : messages.map((m) => {
                            const mine = m.sender_id === user?.id;
                            return (
                                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${mine ? "bg-primary text-white rounded-br-sm" : "bg-gray-100 text-ink rounded-bl-sm"}`}>
                                        {m.text}
                                        <div className={`text-[10px] mt-1 ${mine ? "text-white/60" : "text-muted"}`}>{new Date(m.createdAt).toLocaleString("id-ID", {hour:"2-digit",minute:"2-digit"})}</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={endRef} />
                    </div>

                    {/* input */}
                    <form onSubmit={send} className="p-3 border-t border-line flex items-center gap-2 bg-white">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-1 rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button type="submit" disabled={sending || !text.trim()}
                            className="w-11 h-11 rounded-xl bg-primary hover:bg-primary-dark text-white grid place-items-center disabled:opacity-50 transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}