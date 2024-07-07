import { Routes, Route, Router } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import Home from './components/Home';
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

<<<<<<< HEAD
        
=======
        <Route element={ <RequireAuth allowedRoles={["USER","MANAGER"]} /> }>
          <Route path='home' element= { <Home /> } /> 
        </Route>
>>>>>>> adb39a7ea772c5aef1f53871812620dcf0b51441
      </Routes>
    </AuthProvider>
  );
}

export default App;
