import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css';
import Auth from './components/Auth';
import Home from './components/Home';
import Calendar from './components/Calendar';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <Auth /> } />
      <Route path='/home' element= { <Home /> } /> 
      <Route path="/calendar/:id/:name" element={ <Home/> } />

    </Routes>
  );
}

export default App;
