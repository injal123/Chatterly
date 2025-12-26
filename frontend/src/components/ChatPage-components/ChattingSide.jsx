import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

import ChatHeader from "./ChattingSide-components/ChatHeader";
import NoChatHistory from "./ChattingSide-components/NoChatHistory";
import MessageInput from "./ChattingSide-components/MessageInput";
import LoadingMessages from "./ChattingSide-components/LoadingMessages";

import { Check, CheckCheck } from 'lucide-react';




function ChattingSide() {

  // once selectedUser is set from sidebar, ChattingSide is rendered, then useEffect will call getMessagesByUserId function, fills messages array.
  const { selectedUser, getMessagesByUserId, isLoadingMessages, messages, listenForMessages, stopListeningForMessages,
  listenForTyping, stopListeningForTyping, isTyping } = useChatStore();
  const { authUserInfo } = useAuthStore();
  const messageEndRef = useRef(null);

  // console.log(messages);

  // Time
  function formatMessageTime(time) {
      const msgDate = new Date(time);
      const now = new Date();

      const isToday =
        msgDate.getDate() === now.getDate() &&
        msgDate.getMonth() === now.getMonth() &&
        msgDate.getFullYear() === now.getFullYear();

      const isYesterday =
        msgDate.getDate() === now.getDate() - 1 &&
        msgDate.getMonth() === now.getMonth() &&
        msgDate.getFullYear() === now.getFullYear();

      if (isToday) {
        return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (isYesterday) {
        return `Yesterday, ${msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      } else if ((now - msgDate) / (1000 * 60 * 60 * 24) < 7) {
        return msgDate.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
      } else {
        return msgDate.toLocaleString([], {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
  }



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
  }, [messages, isTyping]);





  // To indicate SENDER IS TYPING ?
  useEffect(() => {
      listenForTyping();

      return () => stopListeningForTyping();
  }, [listenForTyping, stopListeningForTyping]);



  // MESSAGE STATUS - SENT/DELIVERED/SEEN
  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    const myId = useAuthStore.getState().authUserInfo._id;

    if (!selectedUser || !socket) return;

    // CHAT OPENED
    socket.emit("chat_opened", {
      senderId: selectedUser._id,
      receiverId: myId,
    });

    // CHAT CLOSED (cleanup)
    return () => {
      socket.emit("chat_closed", { userId: myId });
    };
  }, [selectedUser]);






  
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
                            ${msg.shouldShake ? "shake" : ""}
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
                                    <time>{formatMessageTime(msg.createdAt)}</time>
                                </p>

                          </div>
                          

                          {/* socket.io */}
                          {/* STATUS - sent/delivered/seen */}
                          <div className="chat-footer text-xs opacity-50">
                            {msg.senderId === authUserInfo._id && (
                              
                              <div className="flex items-center space-x-1 text-xs">
                                  {/* Sent */}
                                  {msg.status === "sent" && (
                                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                                      <Check size={14} />
                                      <span>Sent</span>
                                    </div>
                                  )}

                                  {/* Delivered */}
                                  {msg.status === "delivered" && (
                                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                                      <CheckCheck size={14} />
                                      <span>Delivered</span>
                                    </div>
                                  )}

                                  {/* Seen */}
                                  {msg.status === "seen" && (
                                    <div className="flex items-center gap-1 text-[11px] text-sky-500 mt-1">
                                      <CheckCheck size={14} />
                                      <span>Seen · {formatMessageTime(msg.seenAt)}</span>
                                    </div>
                                  )}

                              </div>

                              
                            )}
                          </div>

                    </div>
                ) ) }



                {/* Typing Indicator */} 
                {isTyping && 
                  
                    <div className="chat chat-start items-center space-x-2">

                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              src={selectedUser.profilePic || "avatar.png"}
                              alt={selectedUser.fullName || "FriendName"}
                              onError={(e) => { e.currentTarget.src = "avatar.png"; }}
                            />
                          </div>
                        </div>
                    
                        <span className="text-slate-500 text-sm">{selectedUser.fullName} is typing</span>
                        <span className="loading loading-dots loading-md"></span>
                    </div>
                }


                


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
