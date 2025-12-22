import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';  // Yepp.




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
    // btw, its null when user opens the app for the first time cz localStorage is empty.
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
    },



    // get all messages between logged-in user and selected chat partner.
    getMessagesByUserId: async (userId) => {
        set({ isLoadingMessages: true });

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } 
        catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            set({ messages: [] });
            console.error("Error in getMessagesByUserId:", error);
        }
        finally {
            set({ isLoadingMessages: false });
        }
    },




    

    // user sends msg to friends.
    sendMessage: async (messageData) => {

        const { selectedUser, messages } = get();  // messages: [m1, m2].
        
        if (!selectedUser) {
            toast.error("Select a user first.");
            return;
        }





        // 2..... MOCKING res - FOR BOTH IMAGE & TEXT...to temporarily append "the msg user just sent" to "messages" array. This makes new image & text appear in the UI faster...before even getting res from server which permanently appends "messages" array with the user msg received from server.
        const { authUserInfo } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`  // fake msg-Id mock.

        const optimisticMessage = {
            _id: tempId,
            senderId: authUserInfo._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,  // flag to identify optimistic messages (optional).
        };

        set({ messages: [...messages, optimisticMessage] })  // 3..... get all messages, append optimisticMessage in it.
        // sets messages= [m1, m2, optimisticMessage]...Temporarily, updates UI with this fake list, which neither gets stored nor gets fetched from server.





        try {
            // 1.... NORMALLY, IN CASE OF IMAGE UPLOAD WITHOUT MOCKING RESPONSE:
            // messageData is sent to the backend & we wait for the response (res).
            // since image upload happens on server (Cloudinary + MongoDB), it takes time.
            // Only after receiving res, the res is appended on messages, causing the new image to appear LATE in the UI. 
            // SO, WE MOCK.

            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`, 
                messageData
            );
            // 4.... In here, messages: [m1, m2] still like this.

            set({ messages: messages.concat(res.data) });   // NOW, messages: [m1, m2, realMsg]...then updates UI with this list. This overwrites the fake list, also being permanent.

            // 5.... FACT: when new msg appends, all existing msg are placed again in divs cz of 
            // messages.map().
        } 
        catch (error) {
            set({ messages: messages });
            toast.error(error?.response?.data?.message || "Something went wrong");
        }

    },





}) )