import { MessageSquareOff } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";







export function NoChatPartnersFound() {

  const { setActiveTab } = useChatStore();


  return ( <>
    <div className="hidden sm:flex flex-col items-center justify-center h-full text-center py-16 bg-slate-700 rounded-xl space-y-6">
        
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center">

          {/* Icon inside */}
          <MessageSquareOff className="w-16 h-16 text-slate-200 relative z-10 animate-bounce" />
          
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


    {/* MINIMAL CONTENT - visible only on mobile */}
    <div className="sm:hidden flex flex-col items-center justify-center h-[95%] text-center bg-slate-700 rounded-xl space-y-6">

        {/* Icon */}
        <MessageSquareOff className="w-10 h-10 text-slate-200 relative z-10 animate-bounce" />

        <span>No Chats Found</span>
        <button
            onClick={() => setActiveTab("contacts")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-cyan-950"
        >
            Find Contacts
        </button>
    </div>



  </>);
}







export const NoContacts = () => {
  return (
  <>


    <div className="hidden sm:flex flex-col items-center justify-center h-full text-center p-6 bg-slate-700 rounded-xl">

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


    {/* MINIMAL CONTENT - visible only on mobile */}
    <div className="sm:hidden flex flex-col items-center justify-center h-[95%] text-center bg-slate-700 rounded-xl space-y-6">

        {/* Icon */}
        <MessageSquareOff className="w-10 h-10 text-slate-200 relative z-10 animate-bounce" />

        <span>No Contacts Found</span>
    </div>

    
  </>);
};