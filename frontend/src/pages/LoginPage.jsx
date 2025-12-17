// rfce
import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AnimatedBorderContainer from '../components/AnimatedBorderContainer';

import { MessageCircle, Mail, LockKeyhole, Loader } from 'lucide-react';
import { Link } from 'react-router';

import Rive from '@rive-app/react-canvas';
import snoozzyBat from '../assets/snoozzybatssy.riv';



import PandaPeek from '../components/PandaPeek.jsx';




function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password:"" });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();   // Prevents the page from reloading.
    login(formData);
  }






  // Panda
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null); // Stores the current countdown timer (persists across renders).
  const typingDelay = 1100;   // panda hides after 1.1 seconds.

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), typingDelay);
  };









  return (
    <div className=' bg-slate-900 w-full p-4 flex justify-center items-center'> 
      <div className=' h-[650px] md:h-[630px] w-full max-w-4xl relative'>

          {/* Panda Peek */}
        <PandaPeek isTyping={ isTyping } />

        <div className='relative z-10'>
            <AnimatedBorderContainer>
              <div className=' w-full flex flex-col md:flex-row'>

                {/* FORM - LEFT SIDE */}   {/* border-slate-600 with opacity 30 */}
                <div className=' md:w-1/2 border-slate-600/30 md:border-r p-8 flex justify-center items-center'>
                  <div className=' w-full max-w-md'>

                      {/* HEADING TEXT */}
                    <div className="text-center mb-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                      <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                      <p className="text-slate-400">Login to access your account</p>
                    </div>

                      {/* FORM - 2 divs for email, pw....one button */}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* EMAIL */}
                        <div>
                          <label className="form-input-label">Email</label>
                          <div className='relative'>
                            <Mail className='form-input-icon'/>
                            <input type="email"
                              className='input'  // from DaisyUI.
                              placeholder='luffy1dinner@gmail.com'
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                handleTyping();
                              }}
                            />
                          </div>
                        </div>


                        {/* PASSWORD */}
                        <div>
                          <label className="form-input-label">Password</label>
                          <div className='relative'>
                            <LockKeyhole className='form-input-icon'/>
                            <input type="password"
                              className='input'  // from DaisyUI.
                              placeholder='Enter your Password'
                              value={formData.password}
                              onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                handleTyping();
                              }}
                            />
                          </div>
                        </div>


                        {/* SUBMIT BUTTON */} 
                        {/* disabled -> Disables button while logging in - to prevent multiple clicks. */}
                        <button type='submit' className='form-btn' disabled={isLoggingIn}> 
                            {isLoggingIn ? (
                                    <>
                                      <Loader className="w-full h-5 text-center animate-spin" />
                                    </>
                                  ) : (
                                    "LogIn"
                                  )}
                        </button>

                    </form>

                    {/* Redirect to signup page if user dont have an account */}
                    <div className='mt-8 text-center'>
                      <Link to="/signup" className='redirect-to-login-signup-link'>
                          Don't have an account? Sign Up
                      </Link>
                    </div>


                  </div>
                </div>



                {/* FORM - RIGHT SIDE */}
                {/* overflow-hidden ==> Anything inside the parent container that goes outside its boundaries will be clipped (hidden). */}
                <div className='hidden md:flex md:w-1/2 p-6 justify-center items-center
                                rounded-full overflow-hidden
                                bg-gradient-to-b from-[#2E398B] to-[#65328F]'>
                  <Rive
                    src={snoozzyBat}
                    stateMachines="State Machine 1" // Make click & hover work.
                    autoplay
                    className='w-96 h-96 scale-150 object-contain -translate-x-[-45px] -translate-y-[-15px]'
                  />

                </div>



              </div>
            </AnimatedBorderContainer>
        </div>

      </div>
    </div>
  );


}

export default LoginPage;