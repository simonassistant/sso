export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string

  // Retrieve the stored state from the cookie
  const storedState = getCookie(event, 'sso_state')

  // Clear the cookie after reading it (one-time use)
  deleteCookie(event, 'sso_state')

  // Validate state
  if (!state || !storedState || state !== storedState) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid state. Possible CSRF attack.'
    })
  }

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code missing.'
    })
  }

  const authUrl = process.env.AUTH_URL
  const ssoSecret = process.env.SSO_SECRET

  try {
    // 1. Request for the token
    const baseUrl = authUrl?.startsWith('http') ? authUrl : `https://${authUrl}`
    const tokenResponse = await $fetch<{ access_token: string }>(`${baseUrl}/BUAM-REST/oauth2/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'LC-AI_TUTOR',
        client_secret: ssoSecret || '',
        redirect_uri: 'https://aitutor.hkbu.edu.hk/api/SSO-redirect',
        code: code
      })
    })
    const accessToken = tokenResponse.access_token

    if (!accessToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to obtain access token.'
      })
    }

    // 2. Get user information
    const userPortfolio = await $fetch(`${baseUrl}/BUAM-REST/oauth2/get_user_portfolio`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // Store user information in a cookie for the result page
    setCookie(event, 'user_info', JSON.stringify(userPortfolio), {
      httpOnly: false, // Allow client-side access to display info
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    })

    // Redirect to the result page
    return sendRedirect(event, '/result')
  } catch (error: any) {
    console.error('SSO Error:', error.data || error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'SSO Authentication failed.'
    })
  }
})
