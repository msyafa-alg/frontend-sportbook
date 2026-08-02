import { useState, useEffect, useRef, useContext } from "react";
import { Send, Search } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import {
    getChatUsersService, getChatConversationService, sendAdminChatService,
} from "../../services/chat.service";

export default function AdminChat() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const endRef = useRef(null);

    async function loadUsers() {
        try { const r = await getChatUsersService(); setUsers(r.data); } catch (e) { /* ignore */ }
    }
    async function loadConv(uid) {
        try { const r = await getChatConversationService(uid); setMessages(r.data.messages); } catch (e) { /* ignore */ }
    }
    async function send(e) {
        e.preventDefault();
        if (!text.trim() || !activeId) return;
        try { await sendAdminChatService(text.trim(), activeId); setText(""); await Promise.all([loadConv(activeId), loadUsers()]); } catch (e) { /* ignore */ }
    }

    useEffect(() => { loadUsers(); }, []);

    // polling: user list tiap 4s, percakapan tiap 3s jika ada aktif
    useEffect(() => {
        const uid = setInterval(() => loadUsers(), 4000);
        return () => clearInterval(uid);
    }, []);
    useEffect(() => {
        if (!activeId) return;
        loadConv(activeId);
        const id = setInterval(() => loadConv(activeId), 3000);
        return () => clearInterval(id);
    }, [activeId]);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const filtered = users.filter((c) => c.user.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Chat Pengguna</h2>
                <p className="text-xs text-gray-400 mt-0.5">Respon pertanyaan dari pelanggan.</p>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden grid md:grid-cols-[280px_1fr] min-h-0">
                {/* sidebar user */}
                <div className="border-r border-gray-100 flex flex-col min-h-0">
                    <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari user..." className="flex-1 bg-transparent text-sm outline-none" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm py-12">Belum ada percakapan</div>
                        ) : filtered.map((c) => (
                            <button key={c.user.id} onClick={() => setActiveId(c.user.id)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeId === c.user.id ? "bg-blue-50/60" : ""}`}>
                                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-400 text-white grid place-items-center font-bold text-sm shrink-0">
                                    {c.user.name.charAt(0)}
                                </span>
                                <span className="flex-1 min-w-0">
                                    <span className="block text-sm font-semibold text-gray-900 truncate">{c.user.name}</span>
                                    <span className="block text-xs text-gray-400 truncate">{c.last_message || "Belum ada pesan"}</span>
                                </span>
                                {c.unread > 0 && (
                                    <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold grid place-items-center">{c.unread}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* percakapan */}
                <div className="flex flex-col min-h-0">
                    {activeId ? (
                        <>
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                <p className="text-sm font-bold text-gray-900">{users.find((u) => u.user.id === activeId)?.user.name || "..."}</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm py-16">Belum ada pesan</div>
                                ) : messages.map((m) => {
                                    const mine = m.sender_id === user?.id;
                                    return (
                                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${mine ? "bg-primary text-white rounded-br-sm" : "bg-white border border-gray-100 text-gray-900 rounded-bl-sm"}`}>
                                                {m.text}
                                                <div className={`text-[10px] mt-1 ${mine ? "text-white/60" : "text-gray-400"}`}>{new Date(m.createdAt).toLocaleString("id-ID", {hour:"2-digit",minute:"2-digit"})}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={endRef} />
                            </div>
                            <form onSubmit={send} className="p-3 border-t border-gray-100 flex items-center gap-2">
                                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Balas sebagai admin..."
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
                                <button type="submit" disabled={!text.trim()} className="w-11 h-11 rounded-xl bg-primary hover:bg-blue-700 text-white grid place-items-center disabled:opacity-50">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 grid place-items-center text-gray-400 text-sm">Pilih pengguna untuk mulai chat</div>
                    )}
                </div>
            </div>
        </div>
    );
}