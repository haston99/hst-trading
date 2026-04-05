import { createClient } from '@insforge/sdk'

const baseUrl = import.meta.env.VITE_INSFORGE_URL || 'https://rh4bwu85.us-east.insforge.app'
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || 'ik_0f9631c409ff804dbd85a18add9ffe1f'

export const client = createClient({
  baseUrl,
  anonKey
})

export const auth = client.auth
export const storage = client.storage
export const realtime = client.realtime
