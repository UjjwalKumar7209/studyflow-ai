import api from '@/lib/axios'
import type { Document, Topic } from '@/types'

export const documentService = {
  async getDocuments(): Promise<Document[]> {
    const res = await api.get('/documents')
    return res.data
  },

  async getDocument(id: number): Promise<Document> {
    const res = await api.get(`/documents/${id}`)
    return res.data
  },

  async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data.document
  },

  async processDocument(id: number): Promise<Document> {
    const res = await api.post(`/documents/${id}/process`)
    return res.data.document
  },

  async getStatus(id: number): Promise<{ status: string }> {
    const res = await api.get(`/documents/${id}/status`)
    return res.data
  },

  async getContent(id: number): Promise<{ content: string }> {
    const res = await api.get(`/documents/${id}/content`)
    return res.data
  },

  async getTopics(id: number): Promise<Topic[]> {
    const res = await api.get(`/documents/${id}/topics`)
    return res.data
  }
}
