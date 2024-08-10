import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AuthContext.Consumer>
              {({ authState }) => authState.isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            </AuthContext.Consumer>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<AuthContext.Consumer>
              {({ authState }) => authState.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            </AuthContext.Consumer>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;