import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

import { useState, useRef } from "react";

import { LogOut, Volume2, VolumeOff, Cog, UserRoundCog } from 'lucide-react';


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

        if (fileInputRef.current) fileInputRef.current.value = ""; // clears URL in <input file tag.
      };
  };

  
// console.log(authUserInfo);
// // console.log(authUserInfo.fullName);
// console.log(authUserInfo.user.fullName);



  return (
    <div className="px-2 py-4 sm:p-3 md:p-6 border-b border-slate-700/50  ">
      <div className="sm:flex sm:justify-between sm:items-center flex-col sm:flex-row space-y-4 sm:gap-[1px] md:gap-3">

        {/* LEFT SIDE - AVATAR & USER INFO */}
        <div className="flex items-center gap-[4px] sm:gap-6px md:gap-3">
  
            {/* AVATAR */}
            <div className="avatar online">      {/* bg-fuchsia-950 */}

                <button className="size-[50px] sm:size-[53px] md:size-14 rounded-full overflow-hidden relative group"
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
                <h3 className="text-slate-300 font-medium text-[18px] sm:text-base truncate">
                  {authUserInfo.fullName}
                </h3>

                <p className="text-slate-400 text-[11px] sm:text-xs">Online</p>
            </div>

        </div>



        {/* RIGHT SIDE - Settings */}
        <div
          data-tip="Settings"
          className="tooltip dropdown relative text-slate-400 hover:text-slate-200 flex justify-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm -mt-3 w-11">
              <Cog />
            </button>


            <ul
              tabIndex={0}
              className="
                menu menu-sm dropdown-content sm:dropdown-left 
                bg-slate-800 text-slate-300
                rounded-xl shadow-xl w-44 p-2
                mt-6 left-16 sm:mt-8 sm:-m-32  md:mt-6
              "
              >
                {/* PROFILE */}
                <li>
                  <button
                    className="flex items-center gap-2 w-full px-2 py-2 rounded
                              hover:bg-slate-700/60 transition"
                  >
                    <UserRoundCog className="size-5" />
                    <span className="text-sm">Profile</span>
                  </button>
                </li>

                {/* SOUND TOGGLE */}
                <li>
                  <button
                    onClick={() => {
                      mouseClickSound.currentTime = 0;
                      mouseClickSound.play().catch(() => {});
                      toggleSound();
                    }}
                    className="flex items-center gap-2 w-full px-2 py-2 rounded
                              hover:bg-slate-700/60 transition"
                  >
                    {isSoundEnabled ? (
                      <Volume2 className="size-5" />
                    ) : (
                      <VolumeOff className="size-5" />
                    )}
                    <span className="text-sm">
                      {isSoundEnabled ? "Mute sound" : "Unmute sound"}
                    </span>
                  </button>
                </li>

                {/* DIVIDER */}
                <li className="my-1 border-t border-slate-700/5" />

                {/* LOG OUT */}
                <li>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-2 py-2 rounded
                                text-red-400 hover:text-red-300
                                hover:bg-red-500/10 transition"
                    >
                      <LogOut className="size-5" />
                      <span className="text-sm">Log out</span>
                    </button>
                </li>
            </ul>


        </div>



        {/* <div className="flex items-center">
              <button 
                  data-tip="LogOut"
                  onClick={logout} className="tooltip text-slate-400 hover:text-slate-200" >
                      <LogOut className="size-5" />
              </button>


              <button
                  data-tip={ isSoundEnabled ? "Mute Sound" : "Unmute Sound" }
                  className="tooltip text-slate-400 hover:text-slate-200"
                  onClick={ () => {
                      mouseClickSound.currentTime = 0;  // reset to start.
                      mouseClickSound.play()
                        .catch( (error) => console.log("Audio Play Failed:", error) );
                      toggleSound();
                  } }>
                          { isSoundEnabled ? <Volume2 className="size-5" /> : <VolumeOff className="size-5" /> }
              </button>
        </div> */}

        
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