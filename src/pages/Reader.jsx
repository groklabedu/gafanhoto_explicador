import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Home as HomeIcon } from 'lucide-react';

function Reader() {
  const { storyId } = useParams();
  const [currentScene, setCurrentScene] = useState(null);
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStartScene();
  }, [storyId]);

  async function loadStartScene() {
    setLoading(true);
    const { data: sceneData, error: sceneError } = await supabase
      .from('scenes')
      .select('*')
      .eq('story_id', storyId)
      .eq('is_start', true)
      .single();

    if (sceneError) {
      console.error('Error loading start scene:', sceneError);
      // If no start scene, try to get the first one
      const { data: firstScene } = await supabase
        .from('scenes')
        .select('*')
        .eq('story_id', storyId)
        .limit(1)
        .single();
      
      if (firstScene) loadScene(firstScene.id);
      else setLoading(false);
    } else {
      loadScene(sceneData.id);
    }
  }

  async function loadScene(sceneId) {
    setLoading(true);
    const { data: sceneData } = await supabase
      .from('scenes')
      .select('*')
      .eq('id', sceneId)
      .single();

    const { data: choicesData } = await supabase
      .from('choices')
      .select('*')
      .eq('source_scene_id', sceneId);

    setCurrentScene(sceneData);
    setChoices(choicesData || []);
    setLoading(false);
  }

  function handleChoice(targetId) {
    setHistory([...history, currentScene.id]);
    loadScene(targetId);
  }

  function handleBack() {
    if (history.length === 0) return;
    const previousId = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    loadScene(previousId);
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Abrindo o livro... 📖</h2>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Ops! Esta história ainda não tem páginas.</h2>
        <Link to="/" className="button primary" style={{ marginTop: '2rem' }}>
          Voltar para Início
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="scene-container">
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="button secondary" style={{ padding: '0.5rem 1rem' }}>
            <HomeIcon size={18} /> Sair
          </Link>
          {history.length > 0 && (
            <button onClick={handleBack} className="secondary" style={{ padding: '0.5rem 1rem' }}>
              <ChevronLeft size={18} /> Voltar
            </button>
          )}
        </div>

        <img 
          src={currentScene.image_url || 'https://images.unsplash.com/photo-1474366521237-c81488f58e02?q=80&w=2000'} 
          alt="Cena" 
          className="story-img"
          style={{ maxHeight: '60vh', objectFit: 'contain', background: '#eef' }}
        />

        <div className="scene-text">
          {currentScene.text}
        </div>

        <div className="choices-container">
          {choices.map(choice => (
            <button 
              key={choice.id} 
              className="primary" 
              onClick={() => handleChoice(choice.target_scene_id)}
            >
              {choice.text} <ChevronRight size={18} />
            </button>
          ))}
          {choices.length === 0 && (
            <div style={{ textAlign: 'center' }}>
              <h3>FIM 🌈</h3>
              <p>Parabéns! Você chegou ao final desta aventura.</p>
              <Link to="/" className="button primary" style={{ marginTop: '1rem' }}>
                Ler outra história
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reader;
