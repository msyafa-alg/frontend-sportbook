import { Spinner } from "flowbite-react";

export default function LoadingComponent() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/70 px-8 py-6 shadow-xl backdrop-blur-md">
                <Spinner size="lg" color="warning" />
                <p className="text-sm text-gray-600">Sedang memuat data...</p>
            </div>
        </div>
    );
}
