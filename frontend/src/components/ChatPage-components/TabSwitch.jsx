import { useChatStore  } from "../../store/useChatStore";





function TabSwitch() {

  const { activeTab, setActiveTab } = useChatStore();


return (
  <div className="flex w-full gap-2 p-1 sm:p-3">
    
    <button
      onClick={() => setActiveTab("contacts")}
      className={`flex-1 rounded-xl py-2 text-sm font-medium transition
        ${
          activeTab === "contacts"
            ? "bg-sky-950 text-white"
            : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
        }`}
    >
      Contacts
    </button>

    <button
      onClick={() => setActiveTab("chats")}
      className={`flex-1 rounded-xl py-2 text-sm font-medium transition
        ${
          activeTab === "chats"
            ? "bg-sky-950 text-white"
            : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
        }`}
    >
      Chats
    </button>
    
  </div>
);




}

export default TabSwitch;