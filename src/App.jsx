import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase.js';
import Home from './pages/Home.jsx';
import Reader from './pages/Reader.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router basename="/gafanhoto_explicador/">
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/read/:storyId" element={<Reader />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute session={session}>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <footer className="footer container">
          <p>© 2024 Histórias Mágicas - Feito com ❤️ para pequenos grandes leitores.</p>
        </footer >
      </div>
    </Router>
  );
}

export default App;
