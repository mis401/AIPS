import { Routes, Route, Router } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import Auth from './components/Auth';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthProvider';
import Welcome from './components/Welcome'

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
  );
}

export default App;
