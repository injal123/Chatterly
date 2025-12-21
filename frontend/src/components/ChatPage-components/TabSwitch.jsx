import { useChatStore  } from "../../store/useChatStore";





function TabSwitch() {

  const { activeTab, setActiveTab } = useChatStore();


  return (
    <div className="tabs tabs-boxed tabs-bordered bg-transparent p-2 m-2 ">

        <button onClick={ () => setActiveTab("contacts") }
            className={`tab ${ activeTab ==="contacts" ? "bg-sky-950 text-white"
          : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200" }`}
        >Contacts</button>


        <button onClick={ () => setActiveTab("chats") }
          className={`tab ${ activeTab ==="chats" ? "bg-sky-950 text-white"
          : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200" }`}
        >Chats</button>

    </div>
  )
}

export default TabSwitch;