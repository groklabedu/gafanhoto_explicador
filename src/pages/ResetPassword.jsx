import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { Key, Lock, Check } from 'lucide-react';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setError('Erro ao atualizar senha: ' + updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/admin'), 2000);
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', padding: '5rem 1rem' }}>
      <div className="card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#4ECDC4', width: '60px', height: '60px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '3px solid #2F3E46' }}>
            <Lock size={30} color="white" />
          </div>
          <h2>Nova Senha</h2>
          <p>Crie uma senha forte e secreta! 🤫</p>
        </header>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ color: '#4ECDC4', marginBottom: '1rem' }}><Check size={48} style={{ margin: '0 auto' }} /></div>
            <h3>Senha atualizada!</h3>
            <p>Redirecionando para o painel...</p>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <Key size={18} /> Nova Senha:
              </label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '15px', border: '3px solid #2F3E46', fontSize: '1rem' }}
                placeholder="No mínimo 6 caracteres"
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <Key size={18} /> Confirmar Senha:
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '15px', border: '3px solid #2F3E46', fontSize: '1rem' }}
              />
            </div>

            {error && <p style={{ color: '#FF6B6B', fontSize: '0.9rem', fontWeight: 'bold' }}>{error}</p>}

            <button type="submit" className="primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
