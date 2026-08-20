import { HiSparkles } from "react-icons/hi2";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center overflow-hidden">
                {/* Background glow accent */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Animated Spinner with Sparkle Icon */}
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin" />
                    <HiSparkles className="absolute text-amber-400 animate-pulse" size={24} />
                </div>

                {/* Loading Text */}
                <div className="space-y-1 z-10">
                    <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-tight">
                        Please Wait
                    </h3>
                    <p className="text-xs text-slate-400 font-medium animate-pulse">
                        Processing your request...
                    </p>
                </div>
            </div>
        </div>
    );
}