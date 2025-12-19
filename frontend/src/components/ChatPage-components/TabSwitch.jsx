import { useChatStore  } from "../../store/useChatStore";





function TabSwitch() {

  const { activeTab, setActiveTab } = useChatStore();


  return (
    <div className="tabs tabs-boxed tabs-bordered bg-transparent p-2 m-2 ">

        <button onClick={ () => setActiveTab("contacts") }
            className={`tab ${ activeTab ==="contacts" ? "bg-[rgb(24,30,40)] text-cyan-600" : "text-slate-400" }`}
        >Contacts</button>


        <button onClick={ () => setActiveTab("chats") }
          className={`tab ${ activeTab ==="chats" ? "bg-[rgb(24,30,40)] text-cyan-600" : "text-slate-400" }`}
        >Chats</button>

    </div>
  )
}

export default TabSwitch;