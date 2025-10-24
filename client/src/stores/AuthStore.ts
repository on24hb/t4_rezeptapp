import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode' // Hilfsbibliothek zum einfachen Dekodieren des Tokens

interface JwtPayload {
  userId: string
  iat?: number
  exp?: number
}

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const loginError = ref<string | null>(null) // Zum Speichern von Login-Fehlern
  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value)

  // Gibt die userId aus dem Token zurück, oder null
  const userId = computed(() => {
    if (token.value) {
      try {
        const decoded = jwtDecode<JwtPayload>(token.value)
        return decoded.userId
      } catch (error) {
        console.error('Fehler beim Dekodieren des JWT:', error)
        logout()
        return null
      }
    }
    return null
  })

  // --- Actions ---

  /**
   * Sendet Login-Anfrage an das Backend und speichert das Token bei Erfolg
   * @param username
   * @param password
   * @returns
   */
  async function login(username: string, password: string): Promise<boolean> {
    loginError.value = null
    try {
      const response = await fetch('https://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        loginError.value = errorData.message || `Fehler (${response.status})`
        return false
      }

      const data = await response.json()
      if (data.token) {
        token.value = data.token
        localStorage.setItem('authToken', data.token)
        return true
      } else {
        loginError.value = 'Kein Token in der Antwort erhalten.'
        return false
      }
    } catch (error) {
      console.error('Netzwerkfehler beim Login:', error)
      loginError.value = 'Netzwerkfehler oder Server nicht erreichbar.'
      return false
    }
  }

  /**
   * Entfernt das Token aus dem State und localStorage.
   */
  function logout() {
    token.value = null
    localStorage.removeItem('authToken')
    loginError.value = null
  }

  // --- Return ---
  // Gib State, Getters und Actions zurück, damit sie in Komponenten verwendet werden können
  return {
    token,
    loginError,
    isLoggedIn,
    userId,
    login,
    logout
  }
})
