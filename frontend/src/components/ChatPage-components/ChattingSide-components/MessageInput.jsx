import { useRef, useState } from "react";
import useKeyboardSound from "../../../hooks/useKeyboardSound";
import { useChatStore } from "../../../store/useChatStore";
import toast from "react-hot-toast";
import { X, Image, Send, Laugh } from "lucide-react";

import EmojiPicker from 'emoji-picker-react';
import { useAuthStore } from "../../../store/useAuthStore";





function MessageInput() {

    // hooks - tool from inside toolbox analogy.
    const { playRandomKeyStrokeSound } = useKeyboardSound();

    const [ text, setText ] = useState("");
    const [ imagePreview, setImagePreview ] = useState(null);

    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    const { isSoundEnabled, sendMessage, selectedUser } = useChatStore(); 
    const { socket } = useAuthStore();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);





    // Select img to be sent to friend.
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;
        if (!file.type.startsWith("image/")) {// E.g. avoids uploading renamed virus.exe → virus.png
          toast.error("Only image files are allowed");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);  // Yepp.
        reader.readAsDataURL(file);
    };



    // Discarding selected img - with Discard-img-btn.
    const removeImage = () => {
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };




    // Submit the Form - sends final & confirmed img choice and text.
    const handleSendMessage = (e) => {
        e.preventDefault();  // prevent reloading of page everytime send-btn is clicked.
        
        if (!text.trim() && !imagePreview) return;
        if (isSoundEnabled) playRandomKeyStrokeSound();

        sendMessage({
          text: text.trim(),
          image: imagePreview
        });

        setText("");    // reset value in input feild to "".
        setImagePreview(null);  // no img selected + do this below stuff.

        if (fileInputRef.current) fileInputRef.current.value = ""; // “no file is selected now”
        // Reset file input field to allow re-selecting the same file. Else URL still stays at this hidden file input field, saying "already selected this img" without letting user noticed, when same img is selected again.
    };






    // To let receiver know if sender is Typing ?
    const handleTyping = () => {
      // console.log("Emitting typing to:", selectedUser._id);
      
      socket.emit("typing", { receiverId: selectedUser._id } );
    };








  return (   // border-at-top
    <div className="border-t border-slate-700/50 p-5">
        
        {/* If img is selected, show this UI at the top of input field. */}
        {imagePreview && (
          <div className="max-w-3xl mx-auto mb-3 flex items-center">

            <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
            </div>
            
          </div>
        )}


        {/* FORM - submits after everything is selected as final */}
        <form 
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto space-x-4 flex relative"
        >
            {/* TEXT INPUT FIELD */}
            <textarea type="text"
            rows={1}
              value={text}
              ref={inputRef}
              onChange={ (e) => {
                  setText(e.target.value);
                  isSoundEnabled && playRandomKeyStrokeSound();

                  //socket.io - SENDER IS TYPING ?
                  handleTyping();


                  // auto-grow logic
                  e.target.style.height = "auto";
                  const maxHeight = 7 * 24; // 7 lines × line-height (~24px)
                  e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + "px";
                  e.target.style.overflowY =
                  e.target.scrollHeight > maxHeight ? "auto" : "hidden";
              } }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();  // prevents newline
                  handleSendMessage(e); // call your send function
                }
              }}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-4 py-3"
              placeholder="Drop a message..."
  
            />




            {/* Emoji button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`${ showEmojiPicker===true ? "text-sky-600 hover:text-sky-400" : "text-slate-400 hover:text-slate-200" }`}
            >
                <Laugh />
            </button>

            {/* Emoji picker */}
            {/* https://www.npmjs.com/package/emoji-picker-react */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 z-50">

                  <EmojiPicker
                    className="-top-3"
                    onEmojiClick={(emojiData) => {
                      setText((prev) => prev + emojiData.emoji);
                    }}
                  />

                  <button 
                    className="absolute bg-sky-800 text-white rounded-full -top-5 -left-4 size-8 flex justify-center items-center"
                     onClick={() => {
                        setShowEmojiPicker(false);        // close emoji picker
                        inputRef.current?.focus();        // focus input automatically
                      }}
                  > 
                      <X /> 
                  </button>

              </div>
            )}





            {/* IMAGE SELECTION FIELD */}
            <input type="file"
              accept="image/*"     // anything starting with image/
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {/* IMAGE SELECTION WITH BUTTON */}
            <button type="button"
              onClick={ () => fileInputRef.current?.click() }
              className={`px-4
                transition-colors ${ imagePreview ? "text-sky-600 hover:text-sky-400" : "text-slate-400 hover:text-slate-200" }
                `}
            >
                  <Image />
            </button>


            {/* SEND BUTTON */}
            <button type="submit"
              disabled={ !text.trim() && !imagePreview }
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${text.trim() || imagePreview
                  ? "text-white hover:text-sky-500"
                  : "text-slate-400 cursor-not-allowed opacity-50"}
                `}
            >
                <Send />
            </button>

        </form>

    </div>
  )
}

export default MessageInput;