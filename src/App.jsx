import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reader from './pages/Reader';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/read/:storyId" element={<Reader />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
        
        <footer className="footer container">
          <p>© 2024 Histórias Mágicas - Feito com ❤️ para pequenos grandes leitores.</p>
          <a href="/admin" className="admin-link">🔓 Admin</a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
