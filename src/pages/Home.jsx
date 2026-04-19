import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

function Home() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  async function fetchStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching stories:', error);
    else setStories(data);
    setLoading(false);
  }

  return (
    <div className="container">
      <header className="header">
        <h1>📚 Histórias Mágicas</h1>
        <p>Escolha uma história e comece sua aventura!</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Carregando histórias...</h2>
        </div>
      ) : stories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Ainda não há histórias cadastradas.</h3>
          <p>Dê um pulinho no Painel Admin para criar a primeira!</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/admin" className="button primary">
              Ir para Admin
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {stories.map(story => (
            <div key={story.id} className="card">
              <img 
                src={story.cover_url || 'https://images.unsplash.com/photo-1543004218-ee14110497f8?q=80&w=2000&auto=format&fit=crop'} 
                alt={story.title} 
                className="story-img"
              />
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <div style={{ marginTop: '1.5rem' }}>
                <Link to={`/read/${story.id}`} className="button primary">
                  <BookOpen size={20} /> Ler Agora
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
