import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

import ChatHeader from "./ChattingSide-components/ChatHeader";
import NoChatHistory from "./ChattingSide-components/NoChatHistory";
import MessageInput from "./ChattingSide-components/MessageInput";
import LoadingMessages from "./ChattingSide-components/LoadingMessages";




function ChattingSide() {

  // once selectedUser is set from sidebar, ChattingSide is rendered, then useEffect will call getMessagesByUserId function, fills messages array.
  const { selectedUser, getMessagesByUserId, isLoadingMessages, messages, listenForMessages, stopListeningForMessages  } = useChatStore();
  const { authUserInfo } = useAuthStore();
  const messageEndRef = useRef(null);

  // console.log(messages);


  useEffect( () => {
      getMessagesByUserId(selectedUser._id);

      listenForMessages();
      // cleanup
      return () => stopListeningForMessages();
  }, 
  [getMessagesByUserId, selectedUser, listenForMessages, stopListeningForMessages] )   // when selectedUser changes, run this effect again.



  useEffect( () => {
      if (messageEndRef.current) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
  }, [messages]);




  return (
    <>
      <ChatHeader />



      {/* Middle div - BETWEEN ChatHeader & InputField. */}
      {/* If there are messages && is not Loading Messages, show messages.
          else if there are messages && is Loading Messages, show LoadingMessages Component.
          else show NoChatHistory Component. */}
      <div className="flex-1 overflow-y-auto px-6 py-8">

        { messages.length > 0 && !isLoadingMessages ? 

          ( 
            <div className="max-w-3xl mx-auto space-y-6">

                { messages.map( (msg) => (
                    <div
                      key={msg._id}         // sender === me ? "to-the right" : "to-the-left"
                      className={`chat ${msg.senderId === authUserInfo._id ? "chat-end" : "chat-start"}`}
                    >
                          {/* AVATAR */}
                          <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt={
                                      msg.senderId === authUserInfo._id
                                        ? authUserInfo.fullName || "UserName"
                                        : selectedUser.fullName || "FriendName"
                                    }
                                    src={
                                      msg.senderId === authUserInfo._id
                                        ? authUserInfo.profilePic || "avatar.png"
                                        : selectedUser.profilePic || "avatar.png"
                                    }
                                    onError={(e) => {
                                      e.currentTarget.src = "avatar.png";
                                    }}
                                />
                            </div>
                          </div>


                          {/* UserName */}
                          <div className="chat-header">
                              {msg.senderId === authUserInfo._id
                                ? authUserInfo.fullName || "UserName"
                                : selectedUser.fullName || "FriendName"}
                          </div>


                          {/* Message div - Image, Text & Time. */}
                          <div className={`chat-bubble p-[4.1px] rounded-s-xl
                            ${
                              msg.senderId === authUserInfo._id
                                ? "bg-sky-700 text-white chat-bubble-end" // sender
                                : ""
                            } 
                          `}>
                                {/* Image */}
                                { msg.image && (
                                  <img 
                                    src={msg.image} 
                                    alt="Shared" 
                                    className="rounded-lg h-48 object-cover" />
                                )}

                                {/* Text */}
                                { msg.text && <p className="px-3 pt-1">{msg.text}</p> }

                                {/* Time when msg was sent. */}
                                <p className="text-xs opacity-50 mt-1 ml-1"> 
                                    <time>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                    </time>
                                </p>

                          </div>

                          {/* socket.io */}
                          {/* STATUS - sent/delivered */}
                          <div className="chat-footer opacity-50">Delivered</div>

                    </div>
                ) ) }


                {/* AUTO-SCROLLING TO BOTTOM */}
                <div ref={messageEndRef} />        
            </div>
          ) 

          : isLoadingMessages ? <LoadingMessages /> :
          
          (   // NoChatHistory - send ur 1st msg to this person.
            <NoChatHistory fullName={ selectedUser.fullName } />   // Let's use props sometimes.
          ) 
        }
          
      </div>



      <MessageInput />

    </>
  )
}

export default ChattingSide;
