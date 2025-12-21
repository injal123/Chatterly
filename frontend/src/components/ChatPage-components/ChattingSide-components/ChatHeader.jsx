import { useEffect } from "react";
import { useChatStore } from "../../../store/useChatStore"
import { X } from 'lucide-react';



function ChatHeader() {

    const { selectedUser, setSelectedUser } = useChatStore();


    useEffect( () => {
        if (!selectedUser) return;

        const handleEscKey = (e) => {
            if (e.key === "Escape") {
                setSelectedUser(null);
            }
        }

        window.addEventListener("keydown", handleEscKey);

        // cleanup function
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [selectedUser, setSelectedUser] );
    


  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b
    border-slate-700/50 max-h-[80px] px-6 flex-1">

        {/* LEFT-SIDE */}
        <div className="flex items-center space-x-3">
            {/* AVATAR */}
            <div className={`avatar online hover:scale-110 transition-all duration-50 ease-out`}>
                <div className="rounded-full h-12 w-12">
                    <img 
                        src={selectedUser.profilePic || "avatar.png"}
                        onError={(e) => e.currentTarget.src = "/avatar.png"} // fallback if image fails to load.
                        alt={selectedUser.fullName} />
                </div>
            </div>

            {/* USER NAME & STATUS */}
            <div>
                <h3 className="text-slate-300 font-mono">
                  {selectedUser.fullName}
                </h3>

                <p className="text-slate-400 text-xs">Online</p>
            </div>
            
        </div>


        {/* RIGHT-SIDE */}
        <button
            className="relative tooltip group mt-2"
            data-tip="Close"
            onClick={ () => setSelectedUser(null)}
        >
            <X className="h-5 w-5 text-slate-400 cursor-pointer transition-all duration-200 ease-out  group-hover:text-red-400 group-hover:scale-125" />
            <span
                className="absolute inset-0 rounded-full bg-red-600 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
        </button>




    </div>
  )
}

export default ChatHeader