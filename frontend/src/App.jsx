// rfce


import { Routes, Route, Navigate } from 'react-router';

import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';


import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

import PageLoader from './components/PageLoader';

import { Toaster } from 'react-hot-toast';





function App() {

  const { authUserInfo, isCheckingAuth, checkAuth } = useAuthStore();

  // useEffect Hooks - Run this code after the component renders, only then run this backend work...avoids page freezing, u know.
  useEffect( () => {
      checkAuth();
  }, [checkAuth] )     // If checkAuth changes → useEffect re-runs.....btw [] only → means run once.

  // console.log({ authUserInfo });

  if (isCheckingAuth) return <PageLoader />;
 

  return (
    // centers the index & login & signup page's outermost main div.
    <div className='bg-slate-900 min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>

<div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-blue-600/30 blur-[140px] rounded-full pointer-events-none" />
<div className="absolute bottom-24 right-24 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none" />

<div className="absolute inset-0 
  bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)]
  bg-[size:12px_12px]
  pointer-events-none
" />




        <Routes>
          <Route path="/" element={ authUserInfo ? <ChatPage /> : <Navigate to={"/login"} /> } />
          <Route path="/login" element={ !authUserInfo ? <LoginPage /> : <Navigate to="/" /> } />
          <Route path="/signup" element={ !authUserInfo ? <SignUpPage /> : <Navigate to="/" /> } />
          <Route path="/profile" element={ authUserInfo ? <ProfilePage /> : <Navigate to={"/login"} /> } />
        </Routes>

        <Toaster />
    
    </div>
  );
}

export default App;










// 1. App renders,
// 2. isCheckingAuth === true → PageLoader renders,
// 3. useEffect runs after render,
// 4. checkAuth() is called,
// 5. checkAuth updates state,
// 6. isCheckingAuth becomes false,
// 7. App re-renders → Routes shown.
