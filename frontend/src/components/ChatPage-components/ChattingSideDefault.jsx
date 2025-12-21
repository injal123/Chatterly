import { MessageCircle, Sparkles } from "lucide-react";



export default function ChattingSideDefault() {

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      
        {/* Icon bubble */}
        <div className="relative mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-sky-400 blur-xl animate-pulse"></div>
            
            <div className="relative flex size-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
              <MessageCircle className="size-9 text-cyan-400" />
              <Sparkles className="absolute -top-2 -right-2 size-5 text-sky-500" />
            </div>
        </div>

        {/* Text */}
        <h2 className="text-lg font-semibold text-slate-200 mb-2">
          Chatterly
        </h2>

        <p className="text-sm text-slate-400 max-w-xs mb-6">
          Looks quiet here. Select your friend & start a conversation to bring this space to life.
        </p>

    </div>
  );
}
