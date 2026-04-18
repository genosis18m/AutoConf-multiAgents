import { useEffect, useRef, useCallback } from 'react'
import { useConferenceStore } from '../store/useConferenceStore'
import type { AgentName, WSMessage } from '../types'
import { WS_BASE } from '../lib/constants'

export function useWebSocket(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const store = useConferenceStore()

  const connect = useCallback(() => {
    if (!sessionId || wsRef.current?.readyState === WebSocket.OPEN) return

    const wsUrl = WS_BASE(sessionId)
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS] Connected', sessionId)
      store.setRunning(true)
    }

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data)

        // Always pull fresh store actions to avoid stale closure
        const { updateAgentStatus, setAgentResult, setPhase, setComplete, setRunning, addLog } =
          useConferenceStore.getState()

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
              updateAgentStatus(msg.agent as AgentName, {
                status: 'failed',
                progress: 0,
                message: msg.message ?? 'Failed',
              })
            }
            addLog(msg.agent ?? 'system', `ERROR: ${msg.message}`)
            break
        }
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

  useEffect(() => {
    if (sessionId) connect()
    return () => {
      wsRef.current?.close()
    }
  }, [sessionId, connect])

  return { connect }
}
