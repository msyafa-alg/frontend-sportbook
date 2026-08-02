// komponen state reusable: loading skeleton & empty state
export function SkeletonCard() {
    return (
        <div className="rounded-[20px] border border-line overflow-hidden">
            <div className="skeleton aspect-[4/3]" />
            <div className="p-4 space-y-2.5">
                <div className="skeleton h-3.5 rounded w-2/3" />
                <div className="skeleton h-3 rounded w-1/3" />
                <div className="skeleton h-6 rounded w-1/2" />
            </div>
        </div>
    );
}

export function EmptyState({ title = "Belum ada data", subtitle, action }) {
    return (
        <div className="text-center py-20 px-4">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-canvas border border-line grid place-items-center text-muted mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <p className="font-bold text-ink text-sm mb-1">{title}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}