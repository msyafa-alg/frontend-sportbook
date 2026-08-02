import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getChatUnreadService } from "../services/chat.service";
import { getChatUsersService } from "../services/chat.service";

export default function NavChat() {
    const { isLogin, user } = useContext(AuthContext);
    const [unread, setUnread] = useState(0);

    async function fetchCount() {
        try {
            if (user?.role === "admin") {
                const r = await getChatUsersService();
                setUnread(r.data.reduce((s, c) => s + c.unread, 0));
            } else {
                const r = await getChatUnreadService();
                setUnread(r.data.unread || 0);
            }
        } catch (e) { /* ignore */ }
    }

    useEffect(() => {
        if (!isLogin) return;
        fetchCount();
        const id = setInterval(fetchCount, 10000);
        return () => clearInterval(id);
    }, [isLogin, user?.role]);

    if (!isLogin) return null;
    const to = user?.role === "admin" ? "/admin/chat" : "/chat";

    return (
        <Link to={to} className="relative w-10 h-10 grid place-items-center rounded-full border border-line hover:border-primary/40 hover:shadow-md transition-all text-ink" aria-label="Chat">
            <MessageSquare className="w-5 h-5" />
            {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
                    {unread > 9 ? "9+" : unread}
                </span>
            )}
        </Link>
    );
}