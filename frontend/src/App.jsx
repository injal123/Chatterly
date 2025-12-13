// rfce


import { Routes, Route } from 'react-router';

import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import { useAuthStore } from './store/useAuthStore';





function App() {

    const { authUser, isLoggedIn, isStudying, login } = useAuthStore();
    console.log("authUser:", authUser);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("isStudying:", isStudying);


 
  return (
    <div className='bg-slate-900 min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>

              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f2c] via-[#1a1a3f] to-[#0c0c2a]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:12px_12px]" />
              <div className="absolute top-0 -left-16 w-96 h-96 bg-purple-800/30 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 -right-16 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(20,150,255,0.1),transparent_80%)] blur-[80px]" />

      <button className='z-10' onClick={login}>loginn</button>

      <Routes>
        <Route path="/" element={ <ChatPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/signup" element={ <SignUpPage /> } />
      </Routes>
    
    </div>
  );
}

export default App;