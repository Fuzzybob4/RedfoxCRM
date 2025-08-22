export interface TestSession {
  userId: string
  email: string
  expiresAt: number
}

const TEST_USERS = [
  { email: "demo@example.com", password: "demo123", userId: "demo-user-123" },
  { email: "john@example.com", password: "john123", userId: "john-doe-456" },
  { email: "jane@example.com", password: "jane123", userId: "jane-smith-789" },
  { email: "test@example.com", password: "test123", userId: "test-user-999" },
]

export function authenticateTestUser(email: string, password: string): TestSession | null {
  const user = TEST_USERS.find((u) => u.email === email && u.password === password)

  if (user) {
    const session: TestSession = {
      userId: user.userId,
      email: user.email,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    // Store in localStorage
    localStorage.setItem("test-auth-session", JSON.stringify(session))

    // Also set as cookie for middleware
    const cookieValue = encodeURIComponent(JSON.stringify(session))
    document.cookie = `test-auth-session=${cookieValue}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`

    console.log("Test user authenticated:", email)
    return session
  }

  return null
}

export function getTestSession(): TestSession | null {
  try {
    const stored = localStorage.getItem("test-auth-session")
    if (!stored) return null

    const session: TestSession = JSON.parse(stored)

    // Check if expired
    if (Date.now() > session.expiresAt) {
      clearTestSession()
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting test session:", error)
    return null
  }
}

export function clearTestSession(): void {
  localStorage.removeItem("test-auth-session")
  document.cookie = "test-auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  console.log("Test session cleared")
}

export function isTestSessionValid(): boolean {
  const session = getTestSession()
  return session !== null
}
