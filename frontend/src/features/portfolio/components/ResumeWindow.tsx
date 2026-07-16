
export default function ResumeWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'var(--bg-window)' }}>
      {/* Action Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderBottom: '1px solid var(--border-light)',
        background: 'var(--bg-window-alt)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Format: PDF / Interactive</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => window.open('/AIAgentEngineer.pdf', '_blank')}
            style={{
              background: 'var(--blue-primary)', color: '#fff', border: 'none',
              borderRadius: 5, padding: '4px 12px', fontSize: 11,
              fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 6
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-bright)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--blue-primary)')}
            title="Download AI Agent Engineer Resume"
          >
            <span>📥</span> AI/ML Resume
          </button>
          <button
            onClick={() => window.open('/SoftwareEngineer.pdf', '_blank')}
            style={{
              background: 'var(--blue-primary)', color: '#fff', border: 'none',
              borderRadius: 5, padding: '4px 12px', fontSize: 11,
              fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 6
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-bright)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--blue-primary)')}
            title="Download Software Engineer Resume"
          >
            <span>📥</span> SDE Resume
          </button>
        </div>
      </div>

      {/* Main Resume Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 0, overflow: 'hidden' }}>
        {/* Left Column (Metadata/Skills) */}
        <div style={{
          borderRight: '1px solid var(--border-light)', padding: '20px 16px',
          background: 'var(--bg-window-alt)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20
        }}>
          {/* Contact Details */}
          <div>
            <h3 style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              # Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <div>📞 +91-9993205227</div>
              <div>✉️ pushkarchaturvedi42@gmail.com</div>
              <div>💻 github.com/PushkarOM</div>
              <div>💼 linkedin.com/in/pushkar-chaturvedi-a83778284</div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              # Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Jaypee University (JUET)</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>B.Tech in Computer Science</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Aug 2023 – Present</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--mint)', fontWeight: 600, marginTop: 2 }}>CGPA: 9.4/10</div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              # Certifications
            </h3>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Andrew Ng Machine Learning Specialization</li>
              <li>Mathematics for Machine Learning</li>
            </ul>
          </div>

          {/* Skills Checklist */}
          <div>
            <h3 style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              # Technical Skills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Languages', items: ['Python', 'Java', 'C++', 'JavaScript', 'SQL'] },
                { name: 'Backend', items: ['Django', 'FastAPI', 'Node.js', 'Express', 'Celery'] },
                { name: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
                { name: 'DevOps / Cloud', items: ['Docker', 'AWS EC2', 'GitHub Actions', 'Linux'] },
                { name: 'AI / ML', items: ['LangChain', 'RAG', 'Chroma', 'PyTorch', 'Hugging Face'] }
              ].map(cat => (
                <div key={cat.name}>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                    {cat.name}:
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {cat.items.map(s => (
                      <span key={s} style={{
                        fontSize: 9, fontFamily: 'var(--font-mono)',
                        background: 'var(--bg-window)', border: '1px solid var(--border-light)',
                        borderRadius: 3, padding: '1px 5px', color: 'var(--text-secondary)'
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Experience & Projects & Achievements) */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
              Pushkar Chaturvedi
            </h1>
            <p style={{ fontSize: 13, color: 'var(--blue-primary)', fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
              Software Engineer | Backend Engineer | AI/ML Engineer
            </p>
          </div>

          {/* Work Experience */}
          <div>
            <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: 4, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💼 Work Experience
            </h2>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Data & Backend Engineering Intern</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 8 }}>— Inventlix (Remote)</span>
                </div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>May 2025 – Jul 2025</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 5, lineHeight: 1.5 }}>
                <li>Engineered RESTful backend services for an inventory management platform using Django REST Framework, delivering secure and maintainable APIs with pagination, filtering and sorting.</li>
                <li>Designed and implemented JWT authentication, Google OAuth and Role-Based Access Control (RBAC), streamlining authorization through token-embedded role claims for production APIs.</li>
                <li>Integrated PostgreSQL, Google Cloud Storage and SendGrid to support persistent data storage, media uploads and automated transactional email workflows.</li>
                <li>Collaborated in a Git-based development workflow to deliver production-ready backend features with emphasis on modular architecture and code quality.</li>
              </ul>
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: 4, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📁 Featured Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* RepoSage */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    RepoSage — Agentic RAG Codebase Assistant
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Completed</span>
                </div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', marginBottom: 6 }}>
                  Stack: Python, FastAPI, LangChain, Chroma, Docker, AWS
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.5 }}>
                  <li>Architected an Agentic RAG platform that indexes GitHub repositories for semantic code search and repository understanding using FastAPI, LangChain and Chroma.</li>
                  <li>Implemented tool-enabled retrieval workflows, conversational memory and file-level search to improve developer productivity while navigating large codebases.</li>
                  <li>Automated backend validation using PyTest and GitHub Actions, enabling continuous integration for every code change.</li>
                  <li>Containerized the application with Docker and deployed it on AWS EC2, creating a reproducible development and deployment workflow.</li>
                </ul>
              </div>

              {/* SkillSwap */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    SkillSwap — Community Learning Platform
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Ongoing</span>
                </div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', marginBottom: 6 }}>
                  Stack: React, Node.js, Express, MongoDB, JWT
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.5 }}>
                  <li>Co-developing a MERN platform that enables collaborative learning through study sessions, reflections and community interactions.</li>
                  <li>Designed a modular Express backend featuring JWT access/refresh authentication, email verification, rate limiting and secure REST APIs.</li>
                  <li>Modeled scalable MongoDB schemas and integrated backend APIs with the React frontend; currently implementing Docker, CI/CD and cloud deployment.</li>
                </ul>
              </div>

              {/* EmotionSense */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    EmotionSense — Multimodal Emotion Assistant
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Completed</span>
                </div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', marginBottom: 6 }}>
                  Stack: FastAPI, React, PyTorch, Hugging Face
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.5 }}>
                  <li>Developed a modular FastAPI backend serving real-time multimodal emotion inference using speech and text models.</li>
                  <li>Integrated REST APIs with an LLM-powered conversational pipeline while emphasizing modular architecture and scalable backend design.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Achievements & Leadership */}
          <div>
            <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: 4, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🏆 Leadership & Achievements
            </h2>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 5, lineHeight: 1.5 }}>
              <li><strong>Secretary, ROS Division, ROSPINOT</strong>: Coordinated technical activities and robotics initiatives for the university club.</li>
              <li><strong>Organizing Team Member</strong>: CodeSrijan Hackathon.</li>
              <li><strong>Top 25 Finalist</strong>: Bharat AI SoC Student Challenge.</li>
              <li><strong>GATE CS 2026</strong>: AIR 7514 (Score: 500).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
