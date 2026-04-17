import axios from 'axios'
import type { ConferenceInput, Session, AllResults } from '../types'
import { API_BASE } from './constants'

const api = axios.create({ baseURL: API_BASE, timeout: 30000 })

export async function startGeneration(input: ConferenceInput): Promise<Session> {
  const { data } = await api.post<Session>('/generate', input)
  return data
}

export async function getStatus(sessionId: string) {
  const { data } = await api.get(`/status/${sessionId}`)
  return data
}

export async function getResults(sessionId: string): Promise<{ session_id: string; results: AllResults }> {
  const { data } = await api.get(`/results/${sessionId}`)
  return data
}

export async function getAgentResult(sessionId: string, agent: string) {
  const { data } = await api.get(`/results/${sessionId}/${agent}`)
  return data
}

export async function exportPDF(sessionId: string): Promise<Blob> {
  const response = await api.post(`/export/${sessionId}`, {}, { responseType: 'blob' })
  return response.data
}
