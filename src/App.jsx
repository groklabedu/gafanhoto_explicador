import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Reader from './pages/Reader.jsx';
import Admin from './pages/Admin.jsx';

function App() {
  return (
    <Router basename="/gafanhoto_explicador/">
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
