import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* You need to build Register.jsx similar to Login */}
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
               <Route path="/" element={<Dashboard />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/gallery" element={<Gallery />} />
               <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;