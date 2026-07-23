import React, { useState } from 'react';
import { Play, Server, Database, Cpu, Layout, Layers } from 'lucide-react';

export const ArchitectureVisualizer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const steps = [
    {
      id: 1,
      title: "1. Client UI & HTML5/CSS3 Layout",
      icon: <Layout size={24} color="#E07A5F" />,
      tag: "Browser Client",
      desc: "User interacts with semantic HTML5 elements. CSS3 GPU compositor renders layout at 60fps.",
      details: "DOM parser builds the Accessibility Tree and CSSOM. User clicks submit button triggering an async synthetic event."
    },
    {
      id: 2,
      title: "2. React.js Fiber Reconciler",
      icon: <Layers size={24} color="#61DAFB" />,
      tag: "React V-DOM",
      desc: "React Fiber schedules concurrent work unit. `useState` hook fires async API request via `fetch()`.",
      details: "Double buffering prepares `workInProgress` tree while non-blocking `startTransition` maintains UI responsiveness."
    },
    {
      id: 3,
      title: "3. Express.js Security & Middleware",
      icon: <Server size={24} color="#9E9E9E" />,
      tag: "Express REST API",
      desc: "Request passes through Helmet headers, CORS policies, rate limiters, and `express.json()` parser.",
      details: "Express matches route `/api/v1/orders` and passes request object to the route controller middleware stack."
    },
    {
      id: 4,
      title: "4. Node.js Event Loop & Libuv Thread Pool",
      icon: <Cpu size={24} color="#43A047" />,
      tag: "Node Runtime",
      desc: "Main thread remains unblocked. Async DB call offloads network socket I/O to OS epoll / Libuv worker pool.",
      details: "Non-blocking event loop continues serving concurrent incoming HTTP requests while waiting for database response."
    },
    {
      id: 5,
      title: "5. MongoDB Aggregation Engine",
      icon: <Database size={24} color="#81B29A" />,
      tag: "MongoDB Cluster",
      desc: "MongoDB mongos router inspects shard keys, executes indexed `$match` & `$group` aggregation pipeline in RAM.",
      details: "B-Tree index covered query returns BSON documents back to Express service layer in under 5ms."
    }
  ];

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);

    let stepCounter = 0;
    const interval = setInterval(() => {
      stepCounter++;
      if (stepCounter < steps.length) {
        setActiveStep(stepCounter);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Visualizer Header */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
              End-to-End MERN Stack Architecture Visualizer
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Interactive simulation of full-stack data flow from Browser DOM to Database Shard
            </p>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleStartSimulation}
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1 }}
          >
            <Play size={18} /> {isSimulating ? "Simulating Request..." : "Run Live MERN Request Flow"}
          </button>
        </div>
      </div>

      {/* Interactive Flow Nodes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {steps.map((st, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep > idx;

          return (
            <div 
              key={st.id} 
              className="glass-card"
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                borderColor: isActive ? 'var(--accent-terracotta)' : isPassed ? 'var(--accent-emerald)' : 'var(--border-color)',
                boxShadow: isActive ? '0 0 25px var(--accent-terracotta-glow)' : undefined,
                transform: isActive ? 'translateY(-4px)' : undefined,
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                {st.icon}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: isActive ? 'var(--accent-terracotta)' : 'var(--bg-tertiary)',
                  color: isActive ? '#0F172A' : 'var(--text-muted)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {st.tag}
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {st.title}
              </h4>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Deep Step Detail Inspector */}
      <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-terracotta)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          {steps[activeStep].icon}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
              Deep Dive: {steps[activeStep].title}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
              Architectural Layer #{steps[activeStep].id}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1rem' }}>
          {steps[activeStep].details}
        </p>

        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--accent-cream)'
        }}>
          💡 100-Year Master Advice: "Always keep client rendering decoupled from backend execution. React handles UI state transitions, Express handles middleware routing, Node handles non-blocking async events, and MongoDB handles high-speed query indexing."
        </div>
      </div>
    </div>
  );
};
