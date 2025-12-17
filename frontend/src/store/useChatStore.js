import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';




export const useChatStore = create( (set, get) => ({
    allContacts: [],
    chatPartners: [],    // chats
    messages: [],        // messages between logged-in user and selected chat partner. (Right side)

    activeTab: "chats",   // /api/messages/chats  - lists of chattedpartners.

    setActiveTab: (tabName) => {
        set({ activeTab: tabName })
    },
        
    isLoadingUsers: false,



    selectedUser: null,

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },

    isLoadingMessages: false,


    // Sound notification.
    // localStorage is used so the user's sound setting persists upon page reloads.
    // From localStorage, gets string as "true" and JSON.parse converts to boolean as true.
    // we compare with === true, to ensure the null or undefined becomes false.
    isSoundEnabled: JSON.parse( localStorage.getItem("enableSound") )  === true,

    toggleSound: () => {
        const gotIsSoundEnabled = get().isSoundEnabled;       // get isSoundEnabled from state. 
        localStorage.setItem("enableSound", !gotIsSoundEnabled);
        set({ isSoundEnabled: !gotIsSoundEnabled });
    },




    // getAllContacts
    getAllContacts: async () => {
        set({ isLoadingUsers: true })

        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } 
        catch (error) {
            set({ allContacts: [] });
            toast.error(error?.response?.data?.message || "Failed to fetch contacts");
            console.error("Error in getAllContacts:", error);
        }
        finally {
            set({ isLoadingUsers: false })
        }
    },


    getAllChattedPartners: async () => {
        set({ isLoadingUsers: true })

        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chatPartners: res.data });
        } 
        catch (error) {
            set({ chatPartners: [] });
            toast.error(error?.response?.data?.message || "Failed to fetch chatted partners");
            console.error("Error in getAllChattedPartners:", error);
        }
        finally {
            set({ isLoadingUsers: false })
        }
    }



}) )