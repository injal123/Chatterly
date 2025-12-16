// rfce

import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import AnimatedBorderContainer from '../components/AnimatedBorderContainer';

import { MessageCircle, UserRound, Mail, LockKeyhole, Loader } from 'lucide-react';

import { Link } from 'react-router';

import Rive from '@rive-app/react-canvas';
import snoozzyBat from '../assets/snoozzybatssy.riv';






 
function SignUpPage() {
  const [formData, setFormData] = useState({ fullName:"", email: "", password:"" });

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();   // Prevents the page from reloading.
    signup(formData);
  }


  return (
    <div className=' bg-slate-900 w-full p-4 flex justify-center items-center'> 
      <div className=' h-[650px] md:h-[630px] w-full max-w-4xl relative'>
        <AnimatedBorderContainer>
          <div className=' w-full flex flex-col md:flex-row'>

            {/* FORM - LEFT SIDE */}   {/* border-slate-600 with opacity 30 */}
            <div className=' md:w-1/2 border-slate-600/30 md:border-r p-8 flex justify-center items-center'>
              <div className=' w-full max-w-md'>

                  {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Create your Account</h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>

                  {/* FORM - 3 divs for fullName, email, pw....one button */}
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* FULL NAME */}
                    <div>
                      <label className="form-input-label">Full Name</label>
                      <div className='relative'>
                        <UserRound className='form-input-icon'/>
                        <input type="text"
                          className='input'  // from DaisyUI.
                          placeholder='Monkey D. Luffy'
                          value={formData.fullName}
                          onChange={ (e) => setFormData({ ...formData, fullName: e.target.value }) } // Keep all other formData fields (fullName="", email="", password="", etc.) the same, but overwrite fullName with the new input value.
                        />
                      </div>
                    </div>


                    {/* EMAIL */}
                    <div>
                      <label className="form-input-label">Email</label>
                      <div className='relative'>
                        <Mail className='form-input-icon'/>
                        <input type="email"
                          className='input'  // from DaisyUI.
                          placeholder='luffy1dinner@gmail.com'
                          value={formData.email}
                          onChange={ (e) => setFormData({ ...formData, email: e.target.value }) } // Keep all other formData fields (fullName="", email="", password="", etc.) the same, but overwrite fullName with the new input value.
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
                          onChange={ (e) => setFormData({ ...formData, password: e.target.value }) } // Keep all other formData fields (fullName="", email="", password="", etc.) the same, but overwrite fullName with the new input value.
                        />
                      </div>
                    </div>


                    {/* SUBMIT BUTTON */} 
                    {/* disabled -> Disables button while signing up - to prevent multiple clicks. */}
                    <button type='submit' className='form-btn' disabled={isSigningUp}> 
                        {isSigningUp ? (
                                <>
                                  <Loader className="w-full h-5 text-center animate-spin" />
                                </>
                              ) : (
                                "SignUp"
                              )}
                    </button>

                </form>

                {/* Redirect to Login page if already have an account */}
                <div className='mt-8 text-center'>
                  <Link to="/login" className='redirect-to-login-link'>
                      Already have an account? Login
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
  );
}

export default SignUpPage;