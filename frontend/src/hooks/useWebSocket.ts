import { useEffect, useRef, useCallback } from 'react'
import { useConferenceStore } from '../store/useConferenceStore'
import type { AgentName, WSMessage } from '../types'

export function useWebSocket(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const { updateAgentStatus, setAgentResult, setPhase, setComplete, setRunning, addLog } = useConferenceStore()

  const connect = useCallback(() => {
    if (!sessionId || wsRef.current?.readyState === WebSocket.OPEN) return

    const wsUrl = `ws://localhost:8000/ws/${sessionId}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS] Connected', sessionId)
      setRunning(true)
    }

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data)
        handleMessage(msg)
      } catch (e) {
        console.error('[WS] Parse error', e)
      }
    }

    ws.onclose = () => {
      console.log('[WS] Disconnected')
    }

    ws.onerror = (e) => {
      console.error('[WS] Error', e)
    }
  }, [sessionId])

  const handleMessage = (msg: WSMessage) => {
    switch (msg.type) {
      case 'agent_status':
        if (msg.agent) {
          updateAgentStatus(msg.agent as AgentName, {
            status: msg.status ?? 'running',
            progress: msg.progress ?? 0,
            message: msg.message ?? '',
          })
          addLog(msg.agent, msg.message ?? '')
        }
        break

      case 'agent_result':
        if (msg.agent && msg.data) {
          setAgentResult(msg.agent as AgentName, msg.data)
        }
        break

      case 'phase_change':
        if (msg.phase) setPhase(msg.phase)
        addLog('system', msg.message ?? `Phase ${msg.phase} started`)
        break

      case 'complete':
        setComplete(true)
        setRunning(false)
        addLog('system', 'All agents completed!')
        break

      case 'error':
        if (msg.agent) {
          updateAgentStatus(msg.agent as AgentName, { status: 'failed', progress: 0, message: msg.message ?? 'Failed' })
        }
        addLog(msg.agent ?? 'system', `ERROR: ${msg.message}`)
        break
    }
  }

  useEffect(() => {
    if (sessionId) connect()
    return () => {
      wsRef.current?.close()
    }
  }, [sessionId, connect])

  return { connect }
}
