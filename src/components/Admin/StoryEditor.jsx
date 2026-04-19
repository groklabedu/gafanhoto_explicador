import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { Save, Plus, ArrowLeft, Image as ImageIcon, Type, Upload, Trash2, Loader2 } from 'lucide-react';

const initialNodes = [];
const initialEdges = [];

function StoryEditor() {
  const { storyId } = useParams();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedScene, setSelectedScene] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    fetchData();
  }, [storyId]);

  async function fetchData() {
    setLoading(true);
    const { data: scenes } = await supabase.from('scenes').select('*').eq('story_id', storyId);
    const { data: choices } = await supabase.from('choices').select('*').filter('source_scene_id', 'in', `(${scenes.map(s => s.id).join(',')})`);

    const flowNodes = scenes.map(scene => ({
      id: scene.id,
      data: { label: scene.text.substring(0, 30) + (scene.text.length > 30 ? '...' : '') },
      position: { x: scene.layout_x || Math.random() * 400, y: scene.layout_y || Math.random() * 400 },
      style: { 
        background: scene.is_start ? '#FF6B6B' : 'white', 
        color: scene.is_start ? 'white' : 'black',
        borderRadius: '12px',
        border: '2px solid #2F3E46',
        padding: '10px',
        width: 150
      }
    }));

    const flowEdges = (choices || []).map(choice => ({
      id: choice.id,
      source: choice.source_scene_id,
      target: choice.target_scene_id,
      label: choice.text,
      animated: true,
      style: { stroke: '#4ECDC4', strokeWidth: 2 }
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
    setLoading(false);
  }

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    async (params) => {
      const text = prompt('Texto do botão da escolha:', 'Próximo');
      if (!text) return;

      const { data, error } = await supabase
        .from('choices')
        .insert([{
          source_scene_id: params.source,
          target_scene_id: params.target,
          text: text
        }])
        .select()
        .single();
      
      if (data) {
        const newEdge = { 
          id: data.id,
          source: params.source,
          target: params.target,
          label: text, 
          animated: true,
          style: { stroke: '#4ECDC4', strokeWidth: 2 } 
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    []
  );

  const onEdgeClick = async (event, edge) => {
    if (confirm('Deseja excluir esta escolha?')) {
      const { error } = await supabase.from('choices').delete().eq('id', edge.id);
      if (!error) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    }
  };

  const onNodeClick = async (_, node) => {
    const { data } = await supabase.from('scenes').select('*').eq('id', node.id).single();
    setSelectedScene(data);
  };

  async function addScene() {
    const { data, error } = await supabase
      .from('scenes')
      .insert([{ 
        story_id: storyId, 
        text: 'Nova página...', 
        layout_x: 100, 
        layout_y: 100,
        is_start: nodes.length === 0 
      }])
      .select()
      .single();

    if (data) {
      setNodes((nds) => nds.concat({
        id: data.id,
        data: { label: 'Nova página...' },
        position: { x: 100, y: 100 },
        style: { background: data.is_start ? '#FF6B6B' : 'white', borderRadius: '12px', border: '2px solid #2F3E46', padding: '10px', width: 150 }
      }));
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${storyId}/${Math.random()}.${fileExt}`;
    const filePath = `scenes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('story-images')
      .upload(filePath, file);

    if (uploadError) {
      alert('Erro ao subir imagem: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('story-images')
      .getPublicUrl(filePath);

    setSelectedScene({ ...selectedScene, image_url: publicUrl });
    setLoading(false);
  }

  async function saveFlow() {
    setLoading(true);
    // Save positions
    for (const node of nodes) {
      await supabase.from('scenes').update({ 
        layout_x: node.position.x, 
        layout_y: node.position.y 
      }).eq('id', node.id);
    }

    // sync choices (delete and recreate for simplicity in MVP)
    // Actually, proper sync is better, but this is a start.
    // For now, let's just save the current selected scene changes.
    if (selectedScene) {
      await supabase.from('scenes').update({
        text: selectedScene.text,
        image_url: selectedScene.image_url,
        is_start: selectedScene.is_start
      }).eq('id', selectedScene.id);
      
      // Update node label
      setNodes(nds => nds.map(n => n.id === selectedScene.id ? { ...n, data: { label: selectedScene.text.substring(0, 30) }, style: { ...n.style, background: selectedScene.is_start ? '#FF6B6B' : 'white' } } : n));
    }

    // Save New Edges / Delete old ones logic would go here.
    // Simplifying: we'll handle choice saves individually in a real version.
    // But for this demo, let's at least save the scene.
    
    alert('Salvo com sucesso!');
    setLoading(false);
  }

  if (loading && nodes.length === 0) return <div>Carregando Mapa...</div>;

  return (
    <div style={{ height: '80vh', border: '4px solid #2F3E46', borderRadius: '24px', overflow: 'hidden', position: 'relative', background: 'white' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', gap: '0.5rem' }}>
        <Link to="/admin" className="button secondary" style={{ padding: '0.5rem' }}><ArrowLeft size={18} /></Link>
        <button onClick={addScene} className="primary" style={{ padding: '0.5rem 1rem' }}><Plus size={18} /> Add Cena</button>
        <button onClick={saveFlow} className="secondary" style={{ padding: '0.5rem 1rem' }}><Save size={18} /> Salvar Tudo</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedScene && (
        <div className="card" style={{ position: 'absolute', right: 20, top: 20, width: '300px', zIndex: 10, boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}>
          <h3>Editar Cena</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Type size={16} /> Texto:</label>
            <textarea 
              value={selectedScene.text}
              onChange={(e) => setSelectedScene({ ...selectedScene, text: e.target.value })}
              style={{ width: '100%', borderRadius: '12px', border: '2px solid #2F3E46', padding: '0.5rem', height: '100px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><ImageIcon size={16} /> Imagem da Cena:</label>
            
            {selectedScene.image_url && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <img src={selectedScene.image_url} alt="Preview" style={{ width: '100%', borderRadius: '12px', border: '2px solid #2F3E46' }} />
                <button 
                  onClick={() => setSelectedScene({ ...selectedScene, image_url: '' })}
                  style={{ position: 'absolute', top: 5, right: 5, padding: '5px', background: '#FF6B6B', boxShadow: 'none', border: '2px solid #2F3E46' }}
                >
                  <Trash2 size={14} color="white" />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Cole a URL ou suba um arquivo ->"
                value={selectedScene.image_url || ''}
                onChange={(e) => setSelectedScene({ ...selectedScene, image_url: e.target.value })}
                style={{ flex: 1, borderRadius: '12px', border: '2px solid #2F3E46', padding: '0.5rem', fontSize: '0.8rem' }}
              />
              <label className="button secondary" style={{ padding: '0.5rem', cursor: 'pointer', boxShadow: 'none' }}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input 
                type="checkbox" 
                checked={selectedScene.is_start} 
                onChange={(e) => setSelectedScene({ ...selectedScene, is_start: e.target.checked })}
              /> Cena Inicial
            </label>
          </div>
          <button onClick={() => setSelectedScene(null)} className="secondary" style={{ width: '100%' }}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default StoryEditor;
