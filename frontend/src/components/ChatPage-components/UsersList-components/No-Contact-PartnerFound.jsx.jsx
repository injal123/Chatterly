import { MessageSquareOff } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";







export function NoChatPartnersFound() {

  const { setActiveTab } = useChatStore();


  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16 bg-slate-700 rounded-xl space-y-6">
        
        {/* Animated gradient circle with icon */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr flex items-center justify-center animate-pulse">
          {/* Glowing background */}
          <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr from-sky-300 to-sky-400  opacity-40 animate-animate-spin-slow"></div>

          {/* Icon inside */}
          <MessageSquareOff className="w-16 h-16 text-cyan-400 relative z-10" />
        </div>



        {/* Text */}
        <div>

          <h4 className="text-slate-200 font-semibold text-3xl mb-2">
            No chats yet?
          </h4>

          <h4 className="text-slate-200 font-semibold text-md mb-2">
            Let’s get the conversation started!
          </h4>

          <p className="text-slate-400 text-sm max-w-xs mx-auto px-2">
            Select a contact from your Contacts tab to begin a conversation.
          </p>

        </div>

        {/* Button */}
        <button
          onClick={() => setActiveTab("contacts")}
          className="px-4 py-3 text-sm font-medium text-cyan-600 bg-cyan-500/10 rounded-lg hover:text-slate-300 hover:border-l-2 hover:border-cyan-400 hover:border-r-2 hover:scale-105 transition-all duration-150"
        >
          Find Contacts
        </button>
      
    </div>
  );
}







export const NoContacts = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-700 rounded-xl">

      <div className="mb-12">
        <MessageSquareOff className="w-20 h-20 text-slate-400" />
      </div>

      <h3 className="text-slate-200 text-lg font-semibold mb-2">
        No contacts yet
      </h3>
      <p className="text-slate-400 text-sm">
        The contact list is empty. Start connecting as soon as next user joins!
      </p>
    </div>
  );
};