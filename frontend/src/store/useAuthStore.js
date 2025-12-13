// Zustand - state management

import { create } from 'zustand';



export const useAuthStore = create( (set) => ({
    authUser: { name: "Injal Thapa", _id:123, age:21 },
    isLoggedIn: false,
    isStudying: false,
    
    login: () => {
        console.log("Logged In.");
        set({ isLoggedIn: true, isStudying: true });
    }
}) )
