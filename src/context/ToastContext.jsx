import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

let idCounter = 0;

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const push = useCallback((type, message) => {
        const id = ++idCounter;
        setToasts((t) => [...t, { id, type, message }]);
        setTimeout(() => remove(id), 4000);
    }, [remove]);

    const api = {
        toast: (message) => push("info", message),
        success: (message) => push("success", message),
        error: (message) => push("error", message),
        info: (message) => push("info", message),
        warning: (message) => push("warning", message),
        remove,
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            <Toaster toasts={toasts} remove={remove} />
        </ToastContext.Provider>
    );
}

function Toaster({ toasts, remove }) {
    const styles = {
        success: { icon: <CheckCircle2 className="w-5 h-5" />, ring: "text-emerald-600" },
        error: { icon: <XCircle className="w-5 h-5" />, ring: "text-red-500" },
        info: { icon: <Info className="w-5 h-5" />, ring: "text-blue-500" },
        warning: { icon: <AlertTriangle className="w-5 h-5" />, ring: "text-amber-500" },
    };

    return (
        <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5">
            <AnimatePresence>
                {toasts.map((t) => {
                    const s = styles[t.type] || styles.info;
                    return (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, x: 60, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.95 }}
                            transition={{ duration: 0.22 }}
                            className="min-w-[260px] max-w-[360px] flex items-start gap-3 bg-white border border-line rounded-2xl px-4 py-3 shadow-lg shadow-ink/10"
                        >
                            <span className={`mt-0.5 shrink-0 ${s.ring}`}>{s.icon}</span>
                            <p className="flex-1 text-sm text-ink font-medium leading-snug">{t.message}</p>
                            <button onClick={() => remove(t.id)} className="text-muted hover:text-ink shrink-0 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}