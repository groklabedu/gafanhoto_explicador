import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { Lock, Mail, Key } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('E-mail ou senha incorretos! Tente novamente. 😅');
      setLoading(false);
    } else {
      // Forçamos o redirecionamento para a rota absoluta de admin
      navigate('/admin', { replace: true });
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', padding: '5rem 1rem' }}>
      <div className="card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#FFE66D', width: '60px', height: '60px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '3px solid #2F3E46' }}>
            <Lock size={30} />
          </div>
          <h2>Portal do Autor</h2>
          <p>Acesso restrito para grandes escritores!</p>
        </header>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
              <Mail size={18} /> E-mail:
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '15px', border: '3px solid #2F3E46', fontSize: '1rem' }}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
              <Key size={18} /> Senha:
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '15px', border: '3px solid #2F3E46', fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>

          {error && <p style={{ color: '#FF6B6B', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

          <button type="submit" className="primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            {loading ? 'Entrando...' : 'Entrar no Mundo Mágico'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
