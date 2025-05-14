import { UserProfile } from '../types/message'

const PROFILE_KEY = 'solalinkProfile'

export async function getLocalProfile(): Promise<UserProfile | null> {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function saveLocalProfile(profile: UserProfile): Promise<void> {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
export {};
  