import AnimatedBorderContainer from '../components/AnimatedBorderContainer';

import { useAuthStore } from "../store/useAuthStore";

import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Camera, Mail, Sprout, Calendar } from "lucide-react";




function ProfilePage() {

  const { isUpdatingProfile, updateProfile, authUserInfo } = useAuthStore();

  const [ selectedImageFile, setSelectedImageFile ] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();



  const handlePfpChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) { // E.g. avoids uploading renamed virus.exe → virus.png!
        toast.error("Only image files are allowed");
        return;
      }

      // Compress image before converting to Base64.
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,            // target max size 1MB
        maxWidthOrHeight: 500,   // resize to 500x500 max
      });

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onloadend = async () => {
        const base64Image = reader.result;

        setSelectedImageFile(base64Image);
        await updateProfile({ profilePic: base64Image });

        if (fileInputRef.current) fileInputRef.current.value = "";
      };
  };


  // console.log(authUserInfo.createdAt);




  return (


    <div className='relative h-[630px] w-full max-w-2xl'>
      <AnimatedBorderContainer>
          <div className='w-full  p-4 sm:p-8 md:p-9 border-b border-slate-700 flex flex-col'>
            
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-700 md:h-20">
                    <button
                      onClick={() => navigate(-1)}   // go back one step, in the history stack.
                      className="p-2 rounded-lg hover:bg-slate-600"
                    >
                      <ArrowLeft />
                    </button>

                    <h2 className="text-lg text-slate-300 font-medium">Your Profile</h2>
                    <div className='opacity-0'>hiiiiii</div>
              </div>


              {/* PROFILE CARD */}
              <div className='bg-slate-800 flex flex-col md:flex-row rounded-2xl shadow-xl mt-9 h-3/4 gap-6 md:gap-2 md:mb-3/4'>

                  {/* Pfp DIV */}
                  <div className=' p-5 md:p-20 flex flex-col items-center justify-center gap-6 md:justify-start'>

                      <div className="relative group">
                        <img
                          src={selectedImageFile || authUserInfo.profilePic || "/avatar.png"}
                          alt="Profile"
                          className="w-24 h-24 md:w-32 md:h-32 md:mt-6 rounded-full object-cover border-4 border-slate-700"
                        />

                        <button
                          disabled={isUpdatingProfile}
                          onClick={() => fileInputRef.current.click()}
                          className="absolute bottom-0 right-1 md:bottom-2 md:right-3 bg-sky-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Camera color='white' size={12} />
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePfpChange}
                        className="hidden"
                      />

                      <h3 className="text-xl font-semibold">{authUserInfo.fullName}</h3>

                  </div>


                  {/* 2nd DIV */}
                  <div className=' px-16 md:px-6 flex flex-col gap-4 md:gap-10 flex-1 md:py-20'>

                      {/* EMAIL */}
                      <div className="flex items-center gap-3">
                          <Mail className="text-slate-400 size-6" />
                          <div>
                            <p className="text-base text-slate-300">Email:</p>
                            <p className="text-sm text-slate-400 ">{authUserInfo.email}</p>
                          </div>
                      </div>


                      {/* STATUS */}
                      <div className="flex items-center gap-3">
                          <Sprout className="text-slate-400 size-6" />

                          <div>
                            <p className="text-base text-slate-300">Status:</p>
                            <p className="text-sm text-green-400 inline-flex items-center gap-2">
                              Online

                              <span className="relative inline-block w-[5px] h-[5px]">
                                  {/* Ping animation */}
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-105 animate-ping" />
                                  
                                  {/* Solid dot */}
                                  <span className="relative inline-flex w-full h-full rounded-full bg-green-400 bottom-[10px]" />
                              </span>

                            </p>
                          </div>
                      </div>



                      {/* JOIN DATE */}
                      <div className="flex items-center gap-3">
                          <Calendar className="text-slate-400 size-6" />
                          <div>
                              <p className="text-base text-slate-300">Joined:</p>
                              <p className="text-sm text-slate-400">
                                { new Date(authUserInfo.createdAt).toLocaleDateString([], {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}

                              </p>
                          </div>
                          
                      </div>

                  </div>

              </div>


          </div>

      </AnimatedBorderContainer>

    </div>




  );
}

export default ProfilePage;