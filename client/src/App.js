import React, { useEffect } from 'react'
import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';
import HomePage from './scenes/homePage/Home';
import LoginPage from './scenes/loginPage/Login';
import ProfilePage from './scenes/profilPage/Profil.jsx';
import ChatSpace from 'components/ChatSpace';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline,ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from 'theme';
import { io } from 'socket.io-client';

function App() {
  // so this is how we grab the mode from the initial state 
  const mode = useSelector((state) =>state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // if the user is logged in or not
  const isAuth = Boolean(useSelector((state) =>state.token));
  //const socket = io('http://localhost:3001');
  const socket = io.connect('http://localhost:3001');

  return (
    <div className="app">
      <BrowserRouter>
       <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/home" element={isAuth ? <HomePage/> : <Navigate to="/" />}/>
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage/> : <Navigate to="/" />}/>
          <Route path="/chat/:userId" element={ <ChatSpace socket={socket}/>} />
        </Routes>
       </ThemeProvider>
      </BrowserRouter>
      
    </div>
  )
}

export default App