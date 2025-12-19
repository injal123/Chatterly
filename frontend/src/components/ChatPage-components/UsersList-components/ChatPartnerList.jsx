import { useEffect } from 'react';
import { useChatStore } from "../../../store/useChatStore";
import LoadingUsers from "./LoadingUsers";

import { NoChatPartnersFound } from "./No-Contact-PartnerFound.jsx.jsx";



function ChatPartnerList() {

  const { getAllChattedPartners, isLoadingUsers, chatPartners, setSelectedUser } = useChatStore();

  // console.log(chatPartners);


  useEffect( () => {
    getAllChattedPartners();
  }, [getAllChattedPartners] )


  if (isLoadingUsers) return <LoadingUsers />;
  if (chatPartners.length === 0) return <NoChatPartnersFound />;


  return (
    <>
      { chatPartners.map( (partner) => (


        <div 
          key={partner._id}
          className='bg-slate-700/70  p-4 rounded-xl cursor-pointer 
          hover:bg-slate-600 hover:text-slate-200 transition-colors'
          onClick={() => setSelectedUser(partner)}
        >
          <div className='flex items-center gap-3'>
              {/* User Avatar */}
              {/* socket.io - STATUS */}
              <div className={`avatar online`}>
                  <div className='size-12 rounded-full'>
                      <img 
                        src={partner.profilePic || "avatar.png"} 
                        alt={partner.fullName}
                        onError={(e) => (e.currentTarget.src = "/avatar.png")}  // fallback if URL fails.
                      />
                  </div>
              </div>

              {/* User Info */}
              <h4 className='font-medium truncate'>{partner.fullName}</h4>
          </div>

        </div>


      ))}
    </>
  )
}

export default ChatPartnerList;