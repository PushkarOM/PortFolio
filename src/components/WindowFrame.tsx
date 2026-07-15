import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWindowManager, WindowId } from '../contexts/WindowContext'

interface WindowFrameProps {
  id: WindowId
  title: string
  zIndex: number
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  x: number
  y: number
  width: number
  height: number
  children: React.ReactNode
}

export default function WindowFrame({
  id,
  title,
  zIndex,
  isOpen,
  isMinimized,
  isMaximized,
  x,
  y,
  width,
  height,
  children,
}: WindowFrameProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId,
  } = useWindowManager()

  const constraintsRef = useRef<HTMLDivElement>(null)
  const [localWidth, setLocalWidth] = useState(width)
  const [localHeight, setLocalHeight] = useState(height)

  // Sync size changes from CMS / Context
  useEffect(() => {
    setLocalWidth(width)
    setLocalHeight(height)
  }, [width, height])

  // Mouse resizing handler
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    focusWindow(id)

    const startWidth = localWidth
    const startHeight = localHeight
    const startX = e.clientX
    const startY = e.clientY

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      const newWidth = Math.max(320, startWidth + deltaX)
      const newHeight = Math.max(240, startHeight + deltaY)
      setLocalWidth(newWidth)
      setLocalHeight(newHeight)
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      // Save final size to global context
      updateWindowSize(id, localWidth, localHeight)
    };

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!isOpen || isMinimized) return null

  const isFocused = activeWindowId === id

  return (
    <motion.div
      drag
      dragHandleClassName="window-title-bar"
      dragMomentum={false}
      dragTransition={{ power: 0 }}
      onDragStart={() => focusWindow(id)}
      onDragEnd={(_, info) => {
        // Update new position in context
        updateWindowPosition(id, x + info.offset.x, y + info.offset.y)
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      style={{
        position: 'absolute',
        left: isMaximized ? 0 : x,
        top: isMaximized ? 36 : y, // 36px offset for TopBar
        width: isMaximized ? '100%' : localWidth,
        height: isMaximized ? 'calc(100vh - 36px - 68px)' : localHeight, // dock is 68px, topbar is 36px
        zIndex: zIndex,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={() => focusWindow(id)}
      className={`window ${isFocused ? 'glow-blue' : ''}`}
    >
      {/* Title bar */}
      <div
        className="window-title-bar"
        style={{
          cursor: isMaximized ? 'default' : 'grab',
          background: isFocused ? 'var(--bg-topbar)' : '#1a2233',
        }}
      >
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div className="window-dot red" onClick={() => closeWindow(id)} title="Close" />
          <div className="window-dot yellow" onClick={() => minimizeWindow(id)} title="Minimize" />
          <div className="window-dot green" onClick={() => maximizeWindow(id)} title="Maximize" />
        </div>
        <span className="window-title">{title}</span>
        {/* Decorative buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.4, marginRight: 6 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Content wrapper */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-window)' }}>
        {children}
      </div>

      {/* Resize handle (bottom right) */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 14,
            height: 14,
            cursor: 'se-resize',
            zIndex: 9999,
            background: 'linear-gradient(135deg, transparent 40%, var(--border-window) 40%, var(--border-window) 60%, transparent 60%, transparent 70%, var(--border-window) 70%)',
          }}
        />
      )}
    </motion.div>
  )
}
