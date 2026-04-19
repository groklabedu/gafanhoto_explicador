import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import StoryEditor from '../components/Admin/StoryEditor';

function Admin() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<StoryList />} />
        <Route path="/edit/:storyId" element={<StoryEditor />} />
      </Routes>
    </div>
  );
}

function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  async function fetchStories() {
    const { data, error } = await supabase.from('stories').select('*');
    if (error) console.error(error);
    else setStories(data);
    setLoading(false);
  }

  async function createStory() {
    const title = prompt('Título da nova história:');
    if (!title) return;

    const { data, error } = await supabase
      .from('stories')
      .insert([{ title, description: 'Uma nova aventura...' }])
      .select()
      .single();

    if (error) alert(error.message);
    else navigate(`/admin/edit/${data.id}`);
  }

  async function deleteStory(id) {
    if (!confirm('Tem certeza que deseja excluir esta história e todas as suas cenas?')) return;
    const { error } = await supabase.from('stories').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchStories();
  }

  return (
    <div>
      <header className="header" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
          <h1>Painel do Autor ✍️</h1>
        </div>
        <button onClick={createStory} className="primary">
          <Plus size={20} /> Nova História
        </button>
      </header>

      {loading ? <p>Carregando...</p> : (
        <div className="grid">
          {stories.map(story => (
            <div key={story.id} className="card">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <Link to={`/admin/edit/${story.id}`} className="button secondary" style={{ flex: 1 }}>
                  <Edit3 size={18} /> Editar
                </Link>
                <button onClick={() => deleteStory(story.id)} className="secondary" style={{ background: '#ffeded', color: '#ff4444', borderColor: '#ff4444', padding: '0.8rem' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
