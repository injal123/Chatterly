// Zustand - state management

import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';



export const useAuthStore = create( (set) => ({       // set, get.
    authUserInfo: null,     // to store response (user-info) received from from backend.
    isCheckingAuth: true,       // for loading spinner.

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/testAuth");      // from auth.route.js line 22.
            set({ authUserInfo: res.data })
        } 
        catch (error) {
            console.log("Error in Auth Check:", error);
            set({ authUserInfo: null })
        }
        finally {
            set({ isCheckingAuth: false })  // do it after both success & failed case.
        }
    },



    // Signup function
    isSigningUp: false,

    signup: async (data) => {        // data -> formData
        set({ isSigningUp: true })

        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUserInfo: res.data })   // res.data received from backend-signup.

            toast.success("Account created successfully!");
        } 
        catch (error) {
            set({ authUserInfo: null })
            toast.error(error?.response?.data?.message || "Something went wrong" );  
                    // error.response.status - received from backend  
                    // message & status part was on backend.
        }                                           
        finally {
            set({ isSigningUp: false })
        }
    },



    // Login function
    isLoggingIn: false,

    login: async (data) => {        // data -> formData
        set({ isLoggingIn: true })

        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUserInfo: res.data })   // res.data received from backend-signup.

            toast.success("Logged In successfully!");
        } 
        catch (error) {
            set({ authUserInfo: null })
            toast.error(error?.response?.data?.message || "Something went wrong" );  
                    // error.response.status - received from backend  
                    // message & status part was on backend.
        }                                           
        finally {
            set({ isLoggingIn: false })
        }
    },



    // Logout function - POST
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUserInfo: null });

            toast.success("Logged Out successfully!");
        } 
        catch (error) {    // no error message in backend tho.  
            toast.error(error?.response?.data?.message || "Error in Logging Out" ); 
            console.log("Logout error:", error);
        }                                           

    }




    // Panda Peeking - 


}) )
