import { Loader } from "lucide-react";

function PageLoader() {
  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">

      {/* Dotted background */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)]
          bg-[size:12px_12px]
          pointer-events-none
        "
      />

      {/* Bottom-right glow */}
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-blue-950 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-24 right-24 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />



      {/* Loader */}
      <div className="relative z-10 flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin text-slate-200" />
      </div>

    </div>
  );
}

export default PageLoader;
