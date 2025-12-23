// Zustand - state management

import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";





export const useAuthStore = create( (set, get) => ({       // set, get.
    authUserInfo: null,     // to store response (user-info) received from from backend.
    isCheckingAuth: true,       // for loading spinner.

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/testAuth");      // from auth.route.js line 22.
            set({ authUserInfo: res.data.user })   // options - user & message.
            
            get().connectSocket();
        } 
        catch (error) {
            console.log("Error in Auth Check:", error);
            set({ authUserInfo: null })    // If user not logged in or session expired.
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
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
        } 
        catch (error) {    // no error message in backend tho.  
            toast.error(error?.response?.data?.message || "Error in Logging Out" ); 
            console.log("Logout error:", error);
        }                                           

    },



    // Update Profile function - PUT
    isUpdatingProfile: false,

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUserInfo: res.data });

            toast.success("Profile updated successfully!");
        } 
        catch (error) {
            // dont set authUserInfo to null here, cz its only profile update failed, not the auth..Else, it will log out the user just on failed profile update lol...cz uk in App.jsx .
            toast.error(error?.response?.data?.message || "Error in updating profile");
            console.error("Error in updateProfile:", error);
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    },





    socket: null,   // options: null OR socket instance (one instance is connected).
                    // socket instance has -> socket.connected === true/false
    onlineUsers: [],

    // connect to socket server right after, signup or login after getting authUserInfo.
    connectSocket: () => {
        const { authUserInfo } = get();
        if (!authUserInfo || get().socket?.connected ) return;

        const newSocket = io(BASE_URL, {
            withCredentials:true   // this ensures cookies are sent with the connection.
        } );

        newSocket.connect();
        set({ socket: newSocket });

        // listen for getOnlineUsers events coming from backend..io.emit
        newSocket.on("getOnlineUsers", (allOnlineUsersId) => {
            set({ onlineUsers: allOnlineUsersId });
        } );

    },


    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect(); 

        set({ socket: null, onlineUsers: [] });
    },




}) )
