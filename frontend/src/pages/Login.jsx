import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(username, password);
    if (result.success) navigate('/dashboard');
    else alert(result.msg);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Login</h2>
        <div className="form-group">
          <input 
            className="form-input" 
            type="text" placeholder="Username" 
            value={username} onChange={e => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <input 
            className="form-input" 
            type="password" placeholder="Password" 
            value={password} onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button className="btn-primary">Login</button>
      </form>
    </div>
  );
};
export default Login;