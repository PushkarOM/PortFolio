import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWindowManager, WindowId } from '../../context/WindowContext'

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


  const [localWidth, setLocalWidth] = useState(width)
  const [localHeight, setLocalHeight] = useState(height)
  const [localX, setLocalX] = useState(x)
  const [localY, setLocalY] = useState(y)
  const [isMobile, setIsMobile] = useState(false)

  const isDraggingRef = React.useRef(false)
  const posRef = React.useRef({ x, y })
  // Tracks live resize dimensions so handleMouseUp reads the final size, not stale useState
  const sizeRef = useRef({ width: localWidth, height: localHeight })

  // Sync size changes from CMS / Context
  useEffect(() => {
    setLocalWidth(width)
    setLocalHeight(height)
  }, [width, height])

  // Sync position changes from context when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      posRef.current = { x, y }
      setLocalX(x)
      setLocalY(y)
    }
  }, [x, y])

  // Mobile screen responsiveness hook
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Custom dragging handler using PointerEvents
  const handleDragPointerDown = (e: React.PointerEvent) => {
    if (showMaximized) return
    if (e.button !== 0) return // left click only

    e.preventDefault()
    e.stopPropagation()
    focusWindow(id)

    isDraggingRef.current = true
    const startX = e.clientX
    const startY = e.clientY
    const startWindowX = posRef.current.x
    const startWindowY = posRef.current.y

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      const newX = startWindowX + deltaX
      // Constrain window top to prevent it from going under/above top bar (36px)
      const newY = Math.max(36, startWindowY + deltaY)

      posRef.current = { x: newX, y: newY }
      setLocalX(newX)
      setLocalY(newY)
    }

    const handlePointerUp = () => {
      isDraggingRef.current = false
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      updateWindowPosition(id, posRef.current.x, posRef.current.y)
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

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
      sizeRef.current = { width: newWidth, height: newHeight }
      setLocalWidth(newWidth)
      setLocalHeight(newHeight)
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      // Read from ref so we get the actual final size, not the stale useState closure value
      updateWindowSize(id, sizeRef.current.width, sizeRef.current.height)
    };

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!isOpen || isMinimized) return null

  const isFocused = activeWindowId === id
  const showMaximized = isMaximized || isMobile

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      style={{
        position: 'absolute',
        left: showMaximized ? 0 : localX,
        top: showMaximized ? 36 : localY, // 36px offset for TopBar
        width: showMaximized ? '100%' : localWidth,
        height: showMaximized ? 'calc(100vh - 36px - 68px)' : localHeight, // dock is 68px, topbar is 36px
        zIndex: zIndex,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
      onMouseDown={() => focusWindow(id)}
      className={`window ${isFocused ? 'glow-blue' : ''}`}
    >
      {/* Title bar */}
      <div
        className="window-title-bar"
        onPointerDown={handleDragPointerDown}
        style={{
          cursor: showMaximized ? 'default' : 'grab',
          background: isFocused ? 'var(--bg-topbar)' : '#1a2233',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="window-title">{title}</span>
        </div>
        
        <div style={{ display: 'flex', height: '100%' }}>
          <button
            className="window-control"
            onClick={() => minimizeWindow(id)}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            title="Minimize"
          >
            &#x2014;
          </button>
          <button
            className="window-control"
            onClick={() => maximizeWindow(id)}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            title="Maximize"
          >
            &#x25A1;
          </button>
          <button
            className="window-control close"
            onClick={() => closeWindow(id)}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            title="Close"
          >
            &#x2715;
          </button>
        </div>
      </div>

      {/* Content wrapper */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-window)' }}>
        {children}
      </div>

      {/* Resize handle (bottom right) */}
      {!showMaximized && (
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
