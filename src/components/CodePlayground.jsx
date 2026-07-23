import React, { useState } from 'react';
import { Play, RotateCcw, Code2, Eye } from 'lucide-react';

export const CodePlayground = () => {
  const defaultCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0F172A;
      color: #F8FAFC;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: linear-gradient(135deg, rgba(224,122,95,0.2), rgba(242,204,143,0.15));
      border: 1px solid #E07A5F;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    button {
      background: #E07A5F;
      color: #0F172A;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.2s;
    }
    button:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="card">
    <h2>🎓 MERN Master Interactive Sandbox</h2>
    <p id="msg">Click the button to test JavaScript execution!</p>
    <button onclick="runTest()">Execute JS Logic</button>
  </div>

  <script>
    function runTest() {
      document.getElementById('msg').innerText = '⚡ JavaScript ES6+ Executed Successfully!';
    }
  </script>
</body>
</html>`;

  const [code, setCode] = useState(defaultCode);
  const [srcDoc, setSrcDoc] = useState(defaultCode);

  const handleRun = () => {
    setSrcDoc(code);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setSrcDoc(defaultCode);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Sandbox Header */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
              Live MERN & Web Dev Code Playground
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Experiment with HTML5, CSS3, and JavaScript logic with real-time browser rendering
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Reset Template
            </button>
            <button className="btn-primary" onClick={handleRun}>
              <Play size={16} /> Run Code
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split Panel */}
      <div className="playground-layout">
        {/* Code Editor Area */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Code2 size={18} />
            <span>Interactive Code Editor</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{
              flex: 1,
              width: '100%',
              minHeight: '400px',
              background: '#090D16',
              color: '#E2E8F0',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Live Preview Iframe */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Eye size={18} />
            <span>Live Output Preview</span>
          </div>

          <iframe
            srcDoc={srcDoc}
            title="sandbox-preview"
            sandbox="allow-scripts"
            style={{
              flex: 1,
              width: '100%',
              minHeight: '400px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              background: '#FFFFFF'
            }}
          />
        </div>
      </div>
    </div>
  );
};
