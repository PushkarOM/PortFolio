import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { portfolioApi, Project, SkillCategory } from '../../../shared/services/api'
import { useWindowManager } from '../../../context/WindowContext'

interface TermLine {
  type: 'prompt' | 'output' | 'error' | 'info' | 'success'
  content: string
}

const HELP_TEXT = `
Available commands:
  help             — show this message
  whoami           — about Pushkar
  projects         — list projects / open window
  project <id>     — view project details
  skills           — technical skills / open window
  experience       — work history timeline / open window
  resume           — view resume details / open window
  contact          — get contact channels / open window
  settings         — open Studio CMS & settings window
  theme <name>     — change theme (aurora | midnight | retro | matrix)
  neofetch         — system specs neofetch style
  coffee           — brew a coffee ☕
  clear            — clear terminal output
  exit             — exit/close terminal window
  ask <question>   — ask Pushkar's AI Assistant anything
`

const COMMAND_LIST = [
  'help',
  'whoami',
  'home',
  'projects',
  'project reposage',
  'project skillswap',
  'project emotionsense',
  'project offline-hindi-assistant',
  'skills',
  'experience',
  'resume',
  'contact',
  'settings',
  'cms',
  'theme aurora',
  'theme midnight',
  'theme retro',
  'theme matrix',
  'neofetch',
  'coffee',
  'clear',
  'exit',
  'ask',
]

interface Props {
  onThemeChange?: (theme: string) => void
}

export default function TerminalWindow({ onThemeChange }: Props) {
  const { openWindow, closeWindow } = useWindowManager()
  const [lines, setLines] = useState<TermLine[]>([
    { type: 'success', content: 'PushkarOS v3.1.4 Terminal' },
    { type: 'output', content: 'Type "help" to list commands, or use tab completion.' },
    { type: 'output', content: '' },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Refs for ask-stream cleanup on unmount (Issue E1)
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup stream timers on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current)
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle autocomplete suggestions
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    const trimmed = input.trim().toLowerCase()
    const matches = COMMAND_LIST.filter(c => c.startsWith(trimmed) && c !== trimmed)
    setSuggestions(matches)
    setActiveSuggestionIdx(-1)
  }, [input])

  const runCommand = async (cmd: string) => {
    const trimmed = cmd.trim()
    const lowerCmd = trimmed.toLowerCase()
    const newLines: TermLine[] = [
      { type: 'prompt', content: `pushkar@os:~$ ${cmd}` },
    ]

    if (lowerCmd === 'clear') {
      setLines([])
      setInput('')
      return
    }

    if (lowerCmd.startsWith('theme ')) {
      const themeName = lowerCmd.split(' ')[1]
      const validThemes = ['aurora', 'midnight', 'retro', 'matrix']
      if (validThemes.includes(themeName)) {
        onThemeChange?.(themeName)
        newLines.push({ type: 'success', content: `✓ Theme changed to "${themeName}"` })
      } else {
        newLines.push({ type: 'error', content: `Unknown theme: "${themeName}". Available: aurora, midnight, retro, matrix` })
      }
      setLines(prev => [...prev, ...newLines])
      setInput('')
      return
    }

    if (lowerCmd === 'matrix') {
      onThemeChange?.('matrix')
      newLines.push({ type: 'success', content: '🟩 ACTIVATING MATRIX MODE...' })
      setLines(prev => [...prev, ...newLines])
      setInput('')
      return
    }

    if (lowerCmd === 'help') {
      newLines.push({ type: 'info', content: HELP_TEXT })
    } else if (lowerCmd === 'exit') {
      newLines.push({ type: 'success', content: 'Exiting terminal...' })
      closeWindow('terminal')
    } else if (lowerCmd === 'home') {
      newLines.push({ type: 'success', content: 'Focusing Home (About Me)...' })
      openWindow('home')
    } else if (lowerCmd === 'settings' || lowerCmd === 'cms') {
      newLines.push({ type: 'success', content: '⚙️ Opening Studio CMS & Settings...' })
      openWindow('studio')
    } else if (lowerCmd === 'whoami') {
      newLines.push(
        { type: 'success', content: '👤 Pushkar' },
        { type: 'output', content: '   AI Engineer & Full Stack Developer' },
        { type: 'output', content: '   Honing skills in Deep Learning, PyTorch, React, Django' },
        { type: 'output', content: '   Current focus: LLM applications, Agents, and Robotics' }
      )
    } else if (lowerCmd === 'projects') {
      openWindow('projects')
      try {
        const projs = await portfolioApi.getProjects()
        newLines.push({ type: 'success', content: `📁 Projects [${projs.length} found] — Opening Projects Window...` })
        projs.forEach(p => {
          newLines.push({ type: 'output', content: `   ${p.id.padEnd(16)} — [${p.status}] ${p.name}: ${p.description.slice(0, 70)}...` })
        })
      } catch (err) {
        newLines.push({ type: 'error', content: 'Failed to load projects from API.' })
      }
      newLines.push({ type: 'info', content: '   → type "project <id>" to view highlights and tech stack.' })
    } else if (lowerCmd.startsWith('project ')) {
      const id = lowerCmd.split(' ')[1]
      try {
        const projs = await portfolioApi.getProjects()
        const proj = projs.find(p => p.id === id)
        if (proj) {
          newLines.push(
            { type: 'success', content: `${proj.emoji} ${proj.name} [Status: ${proj.status}]` },
            { type: 'output', content: `   Description: ${proj.description}` },
            { type: 'output', content: `   Stack:       ${proj.stack.join(', ')}` },
            { type: 'output', content: `   Stars:       ⭐ ${proj.stars}` }
          )
          if (proj.highlights && proj.highlights.length > 0) {
            newLines.push({ type: 'info', content: '   Highlights:' })
            proj.highlights.forEach(h => {
              newLines.push({ type: 'output', content: `     ▸ ${h}` })
            })
          }
          if (proj.githubUrl) {
            newLines.push({ type: 'info', content: `   GitHub:      ${proj.githubUrl}` })
          }
        } else {
          newLines.push({ type: 'error', content: `Project not found: "${id}". Type "projects" to list all.` })
        }
      } catch (err) {
        newLines.push({ type: 'error', content: 'Failed to fetch project details.' })
      }
    } else if (lowerCmd === 'skills') {
      openWindow('skills')
      try {
        const skills = await portfolioApi.getSkills()
        newLines.push({ type: 'success', content: '⚡ Technical Skills — Opening Skills Window...' })
        skills.forEach(cat => {
          newLines.push({ type: 'info', content: `   # ${cat.name}` })
          cat.skills.forEach(s => {
            const bar = '█'.repeat(Math.round(s.level / 10)).padEnd(10, '░')
            newLines.push({ type: 'output', content: `     ${s.name.padEnd(15)} ${bar} ${s.level}%` })
          })
        })
      } catch (err) {
        newLines.push({ type: 'error', content: 'Failed to load skills.' })
      }
    } else if (lowerCmd === 'experience') {
      openWindow('experience')
      try {
        const exps = await portfolioApi.getExperiences()
        newLines.push({ type: 'success', content: '💼 Experience Timeline — Opening Experience Window...' })
        exps.forEach(exp => {
          newLines.push(
            { type: 'info', content: `   ▶ ${exp.role} @ ${exp.company} (${exp.period})` },
            ...exp.achievements.map(a => ({ type: 'output' as const, content: `     ▸ ${a}` })),
            { type: 'output', content: `     Tech Stack: ${exp.stack.join(', ')}` }
          )
        })
      } catch (err) {
        newLines.push({ type: 'error', content: 'Failed to load experiences.' })
      }
    } else if (lowerCmd === 'resume') {
      openWindow('resume')
      newLines.push(
        { type: 'success', content: '📄 Resume summary — Opening Resume Window...' },
        { type: 'output', content: '   Degree: B.Tech Computer Science Engineering (AI & ML)' },
        { type: 'output', content: '   Experience: 2 Internships (ML Engineering, Web Dev)' },
        { type: 'output', content: '   Skills: Python, PyTorch, React, FastAPI, Docker, AWS' },
        { type: 'info', content: '   → Use "download resume" or click Resume in Dock to download PDF.' }
      )
    } else if (lowerCmd === 'contact') {
      openWindow('contact')
      newLines.push(
        { type: 'success', content: '📬 Contact Info — Opening Contact Window...' },
        { type: 'output', content: '   Email:    pushkarchaturvedi42@gmail.com' },
        { type: 'output', content: '   LinkedIn: linkedin.com/in/pushkar-chaturvedi-a83778284' },
        { type: 'output', content: '   Medium:   medium.com/@pushkarchaturvedi42' },
        { type: 'output', content: '   GitHub:   github.com/PushkarOM' }
      )
    } else if (lowerCmd === 'neofetch') {
      newLines.push({
        type: 'output', content: `  /\\_/\\     pushkar@pushkaros
 ( o.o )    -----------------
  > ^ <     OS: PushkarOS 3.1.4
            Host: HP OMEN 16
            Kernel: Linux 6.8.0
            Uptime: ${Math.round(performance.now() / 60000)} mins
            Shell: zsh 5.9
            Theme: ${document.documentElement.getAttribute('data-theme') || 'aurora'}
            CPU: Intel Core i7 (8 cores)
            GPU: NVIDIA RTX 4060 Mobile
            Memory: 16GB RAM` })
    } else if (lowerCmd === 'coffee') {
      try {
        const newCount = await portfolioApi.saveCoffeeCount()
        newLines.push({ type: 'success', content: `☕ Successfully brewed a fresh cup of coffee! Total brewed today: ${newCount}` })
      } catch (err) {
        newLines.push({ type: 'error', content: 'Failed to brew coffee.' })
      }
    } else if (lowerCmd.startsWith('ask ')) {
      const question = trimmed.slice(4)
      setLines(prev => [...prev, ...newLines, { type: 'info', content: '🤖 AI Assistant is thinking...' }])
      setInput('')
      setIsStreaming(true)

      // Simulated stream logic with ref-based cleanup (Issues E1, E4)
      try {
        const projects = await portfolioApi.getProjects()
        const skills = await portfolioApi.getSkills()

        streamTimeoutRef.current = setTimeout(() => {
          const answer = getMockAIAnswer(question, projects, skills)
          const words = answer.split(' ')
          let currentText = ''
          let wordIdx = 0

          // Replace the "Thinking..." line with the starting stream
          setLines(prev => {
            const next = [...prev]
            next[next.length - 1] = { type: 'success', content: '🤖 AI Answer:' }
            return next
          })

          streamIntervalRef.current = setInterval(() => {
            if (wordIdx < words.length) {
              currentText += (wordIdx === 0 ? '' : ' ') + words[wordIdx]
              setLines(prev => {
                const next = [...prev]
                const lastLine = next[next.length - 1]
                if (lastLine.type === 'output') {
                  next[next.length - 1] = { type: 'output', content: currentText }
                } else {
                  next.push({ type: 'output', content: currentText })
                }
                return next
              })
              wordIdx++
            } else {
              if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
              setIsStreaming(false)
            }
          }, 80)
        }, 800)
      } catch (err) {
        setLines(prev => [...prev, { type: 'error', content: 'Failed to fetch context for AI assistant.' }])
        setIsStreaming(false)
      }

      setHistory(prev => [cmd, ...prev.slice(0, 49)])
      setHistoryIdx(-1)
      return
    } else if (trimmed === '') {
      // do nothing
    } else {
      // Fuzzy match help suggestion
      const matches = COMMAND_LIST.filter(c => c.startsWith(lowerCmd.slice(0, 3)))
      let errText = `Command not found: "${trimmed}". Type "help" to list commands.`
      if (matches.length > 0) {
        errText += `\n   Did you mean: ${matches.join(', ')}?`
      }
      newLines.push({ type: 'error', content: errText })
    }

    setLines(prev => [...prev, ...newLines])
    setHistory(prev => [cmd, ...prev.slice(0, 49)])
    setHistoryIdx(-1)
    setInput('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activeSuggestionIdx >= 0 && suggestions[activeSuggestionIdx]) {
        setInput(suggestions[activeSuggestionIdx])
        setSuggestions([])
      } else {
        runCommand(input)
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0) {
        const nextIdx = (activeSuggestionIdx + 1) % suggestions.length
        setActiveSuggestionIdx(nextIdx)
        setInput(suggestions[nextIdx])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(idx)
      setInput(history[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    }
  }

  const getMockAIAnswer = (q: string, projects: Project[], skills: SkillCategory[]): string => {
    const query = q.toLowerCase()

    if (query.includes('project') || query.includes('build') || query.includes('make')) {
      const projNames = projects.map(p => p.name).join(', ')
      return `Pushkar has built several key projects, including: ${projNames}. Among them, EmotionSense stands out for deep learning facial recognition, and RepoSage is an AI code reviewer using GPT-4 and RAG. You can explore them in detail by typing "project emotionsense" or opening the Projects application in the dock.`
    }

    if (query.includes('emotionsense')) {
      return `EmotionSense is a real-time facial emotion recognition system. It achieves 94.2% accuracy using custom deep Convolutional Neural Networks (CNNs) trained on the FER-2013 dataset. The backend is powered by PyTorch and OpenCV, with real-time frame streaming supported by WebSockets and FastAPI.`
    }

    if (query.includes('reposage')) {
      return `RepoSage is a smart developer assistant that reviews code repositories. It integrates GPT-4 with a Retrieval-Augmented Generation (RAG) architecture to ingest full codebases, identify security vulnerabilities, suggest enhancements, and explain repository structures.`
    }

    if (query.includes('skills') || query.includes('stack') || query.includes('technolog')) {
      const categories = skills.map(c => `${c.name} (${c.skills.map(s => s.name).join(', ')})`).join('; ')
      return `Pushkar's technical capabilities include: ${categories}. His core strengths are in Machine Learning (PyTorch, TensorFlow) and Full-Stack development (React, FastAPI, Docker, and AWS).`
    }

    if (query.includes('experience') || query.includes('job') || query.includes('intern')) {
      return `Pushkar interned as a Data & Backend Engineering Intern at Inventlix (Remote, May–Jul 2025), where he built RESTful CRUD APIs with Django and React, implemented JWT + Google OAuth auth with RBAC, and integrated Google Cloud Storage and SendGrid for transactional emails with cron-based expiry notifications.`
    }

    if (query.includes('who') || query.includes('about') || query.includes('pushkar')) {
      return `Pushkar is an AI Engineer and Full Stack Developer based in India. He specializes in designing robust neural networks, implementing Retrieval-Augmented Generation (RAG), and developing high-performance web systems. He is highly passionate about AI, robotics, and clean product design.`
    }

    return `Thanks for asking! I'm Pushkar's personal workspace assistant. I can help explain his work, outline details about ${projects.map(p => p.name).join(', ')}, or discuss his work history. What would you like to know more about?`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Terminal body */}
      <div
        style={{
          flex: 1,
          background: 'var(--bg-terminal)',
          padding: '12px 14px',
          overflowY: 'auto',
          cursor: 'text',
          minHeight: 0,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11.5,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: line.type === 'prompt' ? 'var(--text-terminal)'
              : line.type === 'success' ? 'var(--mint)'
              : line.type === 'error' ? '#EF4444'
              : line.type === 'info' ? 'var(--blue-sky)'
              : 'rgba(148,163,184,0.8)',
          }}>
            {line.content}
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-terminal)', whiteSpace: 'nowrap' }}>
            pushkar@os:~$
          </span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck={false}
            disabled={isStreaming}
            style={{ opacity: isStreaming ? 0.5 : 1 }}
          />
          <span className="cursor-blink" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-terminal)' }}>█</span>
        </div>

        {/* Autocomplete Panel */}
        {suggestions.length > 0 && (
          <div style={{
            marginTop: 8,
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-terminal-dim)',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <span style={{ color: 'var(--blue-bright)' }}>Suggestions:</span>
            {suggestions.map((s, idx) => (
              <span
                key={s}
                style={{
                  color: idx === activeSuggestionIdx ? 'var(--mint)' : 'var(--text-terminal-dim)',
                  background: idx === activeSuggestionIdx ? 'rgba(52,211,153,0.1)' : 'transparent',
                  padding: '1px 5px',
                  borderRadius: 4,
                }}
              >
                {s}
              </span>
            ))}
            <span style={{ fontSize: 9.5, opacity: 0.6 }}>(Tab to navigate)</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
