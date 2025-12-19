import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

import { useState, useRef } from "react";

import { LogOut, Volume2, VolumeOff } from 'lucide-react';


const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

import { toast } from "react-hot-toast";

import imageCompression from "browser-image-compression";






function ProfileHeader() {

  const { isUpdatingProfile, updateProfile, authUserInfo, logout } = useAuthStore();
  const { toggleSound, isSoundEnabled } = useChatStore();

  


  const [ selectedImageFile, setSelectedImageFile ] = useState(null);

  const fileInputRef = useRef(null);  // allows to programmatically click the hidden file input no matter where it is in the component tree....just with button click.
  // allow no need of re-rendering of component when ref value changes.

  const handlePfpChange = async (e) => {
      const file = e.target.files[0];  // Get the first (or only) binary img file the user selected.
      if (!file) return;                   //  If no file was selected, exit doin nth.

      if (!file.type.startsWith("image/")) { // E.g. avoids uploading renamed virus.exe → virus.png!
        toast.error("Only image files are allowed");
        return;
      }

      // Compress image before converting to Base64.
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,            // target max size 1MB
        maxWidthOrHeight: 500,   // resize to 500x500 max
      });

      const reader = new FileReader();     //  Create a FileReader to read the file.
      reader.readAsDataURL(compressedFile);          //  converts that binary into a Base64 string (Data URL).

      reader.onloadend = async () => {           //  When reading is complete,
        const base64Image = reader.result;       // reader.result contains the base64 string (URL).
        setSelectedImageFile(base64Image);       //  Store it in state to show a preview.
        await updateProfile({ profilePic: base64Image }); // Send it to backend for upload in cloudinary & MongoDB.
      };
  };

  
// console.log(authUserInfo);
// // console.log(authUserInfo.fullName);
// console.log(authUserInfo.user.fullName);



  return (
    <div className="p-6 border-b border-slate-700/50  ">
      <div className="flex justify-between items-center">

        {/* LEFT SIDE - AVATAR & USER INFO */}
        <div className="flex gap-3 items-center">
  
            {/* AVATAR */}
            <div className="avatar online ">      {/* bg-fuchsia-950 */}

                <button className="size-14 rounded-full overflow-hidden relative group"
                  disabled={isUpdatingProfile}
                  onClick={ () => fileInputRef.current.click() } >

                  { isUpdatingProfile ? (<span className="loading loading-ring loading-md"></span>) 
                    : 
                    (
                      <>
                        <img src={ selectedImageFile || authUserInfo.profilePic || "avatar.png" }
                          onError={(e) => e.currentTarget.src = "/avatar.png"} // fallback if image fails to load.
                          alt="User img"
                          className="size-full object-cover" 
                        />

                        {/* Hover effect on img - only when NOT updating img */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs">Change</span>
                        </div>

                      </> 
                    )
                  }

                </button>  {/* click on input tag, upon button clicked. */}

                <input type="file"
                    accept="image/*"     // anything starting with image/
                    ref={fileInputRef}
                    onChange={handlePfpChange}
                    className="hidden"
                />
            </div>


            {/* USER NAME & STATUS */}
            <div>
                <h3 className="text-slate-300 font-medium text-base max-w-[140px] truncate">
                  {authUserInfo.fullName}
                </h3>

                <p className="text-slate-400 text-xs">Online</p>
            </div>

        </div>



        {/* RIGHT SIDE - logout & Sound button */}
        <div className="flex gap-4 items-center">
              <button onClick={logout} className="text-slate-400 hover:text-slate-200" >
                    <LogOut className="size-5" />
              </button>


              <button 
                  className="text-slate-400 hover:text-slate-200"
                  onClick={ () => {
                      mouseClickSound.currentTime = 0;  // reset to start.
                      mouseClickSound.play()
                        .catch( (error) => console.log("Audio Play Failed:", error) );
                      toggleSound();
                  } }>
                          { isSoundEnabled ? <Volume2 className="size-5" /> : <VolumeOff className="size-5" /> }
              </button>
        </div>

        
      </div>     
    </div>
  )
}

export default ProfileHeader;




{/* <div className="avatar online">
        <div className="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
</div> */}