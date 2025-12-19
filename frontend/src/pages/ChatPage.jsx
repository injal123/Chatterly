import AnimatedBorderContainer from '../components/AnimatedBorderContainer';

import { useChatStore } from '../store/useChatStore';

import ProfileHeader from '../components/ChatPage-components/ProfileHeader';
import TabSwitch from '../components/ChatPage-components/TabSwitch';
import ChatPartnerList from '../components/ChatPage-components/UsersList-components/ChatPartnerList';
import ContactList from '../components/ChatPage-components/UsersList-components/ContactList';
import ChatContainer from '../components/ChatPage-components/ChatContainer';
import DefaultContainer from '../components/ChatPage-components/DefaultContainer';






function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();


  return (
    <div className='relative h-[800px] w-full max-w-6xl '>
        <AnimatedBorderContainer>
            {/* LEFT SIDE */}
            <div className='w-80 bg-slate-800/50 flex flex-col backdrop-blur-sm'>
                  <ProfileHeader />
                  <TabSwitch />
                  {/* <SearchBar /> */}
                  
                  {/* Take all remaining space inside a flex container, vertical scrollbar,..,.. */}
                  <div className='flex-1 overflow-y-auto p-4 space-y-2 '>
                      { activeTab === "chats" ? <ChatPartnerList /> : <ContactList /> }
                  </div>
            </div>


            {/* RIGHT SIDE */}
            <div className='flex-1 bg-slate-900/50 flex flex-col '>
                  { selectedUser ? <ChatContainer /> : <DefaultContainer /> }
            </div>

        </AnimatedBorderContainer>

    </div>
  );
}

export default ChatPage;