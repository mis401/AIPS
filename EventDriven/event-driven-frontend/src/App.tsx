import { Routes, Route, Router } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import Auth from './components/Auth';
import Home from './components/Home';
<<<<<<< HEAD
import Calendar from './components/Calendar';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <Auth /> } />
      <Route path='/home' element= { <Home /> } /> 
      <Route path="/calendar/:id/:name" element={ <Home/> } />

    </Routes>
=======
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={ <Welcome /> } />
        <Route path='auth' element={ <Auth /> } />
        <Route path='home' element={ <Home />} />
        <Route path='unauthorized' element={ <Unauthorized /> } />

        <Route element={ <RequireAuth allowedRoles={["USER","MANAGER"]} /> }>
          <Route path='home' element= { <Home /> } /> 
        </Route>
      </Routes>
    </AuthProvider>
>>>>>>> main
  );
}

export default App;
