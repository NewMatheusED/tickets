import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import useAuth from './hooks/useAuth';

import Layout from './components/Layout/Layout';

import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Tickets from './pages/Tickets/Tickets';
import Config from './pages/Config/Config';

function App() {
  
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />} >
            <Route path="/home" element={<Tickets />} />
            <Route path="/config" element={<Config />} />
          </Route>
        </Routes>
      </AuthWrapper>
    </Router>
  );
}

function AuthWrapper({ children }) {
  useAuth();
  return (
    <div className='app'>
      {children}
    </div>
  );
}

export default App;
