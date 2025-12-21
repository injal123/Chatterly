import { Sparkles } from "lucide-react";

export default function NoChatHistory({ fullName }) {
  return (
    <div className="relative flex flex-col justify-center h-full px-12 text-slate-300 overflow-hidden">

        {/* Ambient glow */}    {/* inset-0 ==> top: 0; right: 0; bottom: 0; left: 0 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_65%)] animate-pulse" />


        <div className="relative max-w-md space-y-5">
            
            {/* Accent row */}
            <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="w-4 h-4 animate-[pulse_2.5s_ease-in-out_infinite]" />
                <span className="text-xs uppercase tracking-widest text-cyan-500/90 ">
                    New conversation
                </span>
            </div>

            {/* Main heading */}
            <h2 className="text-2xl font-semibold text-slate-100 leading-snug">
                Between You and{" "}
                <span className="text-cyan-500 drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                    {fullName}
                </span>
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Messages you send here will be visible only to the two of you.
                Send your first message to break the ice.
            </p>

            {/* Divider */}
            <div className="pt-2">
                <div className="h-px w-24 bg-gradient-to-r from-cyan-400/60 via-cyan-400/20 to-transparent" />
            </div>

            {/* Tip */}
            <p className="text-xs text-slate-500 italic animate-pulse">
            Tip: A simple “Hey 👋” works.
            </p>
        </div>

    </div>
  );
}




// leading-tight, leading-snug, leading-normal, leading-relaxed.