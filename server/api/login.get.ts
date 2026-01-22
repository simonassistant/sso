import { randomBytes } from 'node:crypto'

export default defineEventHandler(async (event) => {
    // Generate a random state
    const state = randomBytes(16).toString('hex')

    // Store state in an HttpOnly, Secure cookie
    setCookie(event, 'sso_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 5 // 5 minutes
    })

    const params = new URLSearchParams({
        Auth: 'true',
        response_type: 'code',
        redirect_uri: 'https://aitutor.hkbu.edu.hk/api/SSO-redirect',
        client_id: 'LC-AI_TUTOR',
        scope: 'get_user_portfolio',
        state: state
    })

    const authUrlEnv = process.env.AUTH_URL
    const baseUrl = authUrlEnv?.startsWith('http') ? authUrlEnv : `https://${authUrlEnv}`
    const authUrl = `${baseUrl}/buam/Auth?${params.toString()}`
    return sendRedirect(event, authUrl)
})
