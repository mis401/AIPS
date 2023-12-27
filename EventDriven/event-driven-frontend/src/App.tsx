import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import Home from './components/Home';
import Calendar from './components/Calendar';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <Welcome /> } />
      <Route path='auth' element={ <Auth /> } />
      <Route path='home' element= { <Home /> } /> /* da li ce ovde da stoji Calendar kao podruta obzirom da je uvek na home? */
    </Routes>
  );
}

export default App;
