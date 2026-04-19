import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { Mail, ArrowLeft, Send } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleResetRequest(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // O redirectTo deve ser a rota de reset-password no seu site
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/gafanhoto_explicador/reset-password`,
    });

    if (resetError) {
      setError('Erro ao enviar e-mail: ' + resetError.message);
    } else {
      setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada. 📬');
    }
    setLoading(false);
  }

  return (
    <div className="container" style={{ maxWidth: '400px', padding: '5rem 1rem' }}>
      <div className="card">
        <header style={{ marginBottom: '2rem' }}>
          <Link to="/login" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Voltar ao Login
          </Link>
          <h2>Esqueci a Senha</h2>
          <p>Não se preocupe! Vamos te ajudar a voltar para a história.</p>
        </header>

        <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
              <Mail size={18} /> Seu E-mail:
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

          {error && <p style={{ color: '#FF6B6B', fontSize: '0.9rem', fontWeight: 'bold' }}>{error}</p>}
          {message && <p style={{ color: '#4ECDC4', fontSize: '0.9rem', fontWeight: 'bold' }}>{message}</p>}

          <button type="submit" className="primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Enviando...' : <><Send size={18} /> Enviar Instruções</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
