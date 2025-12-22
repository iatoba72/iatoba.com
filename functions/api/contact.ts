interface Env {
  N8N_WEBHOOK_URL: string
  N8N_WEBHOOK_TOKEN: string
  WEB3FORMS_ACCESS_KEY: string
}

interface EventContext {
  request: Request
  env: Env
  params: Record<string, string>
  waitUntil: (promise: Promise<any>) => void
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>
}

interface ContactFormRequest {
  firstName: string
  lastName: string
  email: string
  message: string
  honeypot?: string
  formLoadTime: number
}

interface ContactFormResponse {
  success: boolean
  message?: string
  webhookSuccess?: boolean
  web3formsSuccess?: boolean
}

// Handle CORS preflight
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

// Main POST handler
export const onRequestPost = async (context: EventContext) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  try {
    // Parse request body
    const requestData: ContactFormRequest = await context.request.json()

    // === SPAM PROTECTION ===

    // 1. Honeypot check (silent rejection)
    if (requestData.honeypot && requestData.honeypot.trim() !== '') {
      console.log('[Contact] Bot detected: honeypot filled')
      return new Response(
        JSON.stringify({ success: true } as ContactFormResponse),
        { headers: corsHeaders }
      )
    }

    // 2. Timing check (silent rejection)
    const timeSpent = Date.now() - requestData.formLoadTime
    if (timeSpent < 3000) {
      console.log('[Contact] Bot detected: too fast', timeSpent, 'ms')
      return new Response(
        JSON.stringify({ success: true } as ContactFormResponse),
        { headers: corsHeaders }
      )
    }

    // === VALIDATION ===

    if (!requestData.firstName?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'First name is required'
        } as ContactFormResponse),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!requestData.lastName?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Last name is required'
        } as ContactFormResponse),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!requestData.email?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email is required'
        } as ContactFormResponse),
        { status: 400, headers: corsHeaders }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(requestData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please enter a valid email address'
        } as ContactFormResponse),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!requestData.message?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Message is required'
        } as ContactFormResponse),
        { status: 400, headers: corsHeaders }
      )
    }

    if (requestData.message.trim().length < 10) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Message must be at least 10 characters'
        } as ContactFormResponse),
        { status: 400, headers: corsHeaders }
      )
    }

    // === PREPARE DATA ===

    const fullName = `${requestData.firstName} ${requestData.lastName}`
    const timestamp = new Date().toISOString()
    const messageId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // === SUBMISSION 1: n8n WEBHOOK ===

    let webhookSuccess = false

    if (context.env.N8N_WEBHOOK_URL) {
      try {
        const webhookPayload = {
          // Message identifiers
          id: messageId,
          message_id: messageId,

          // Sender information
          from: `${fullName} <${requestData.email}>`,
          sender_email: requestData.email,

          // Content
          subject: `Website Contact: ${fullName}`,
          body: requestData.message,
          snippet: requestData.message.substring(0, 200),

          // Additional metadata
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          source: 'iatoba.com_contact_form',
          date: timestamp,
          submittedAt: timestamp,
        }

        const webhookResponse = await fetch(context.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(context.env.N8N_WEBHOOK_TOKEN && {
              'X-Webhook-Token': context.env.N8N_WEBHOOK_TOKEN
            }),
          },
          body: JSON.stringify(webhookPayload),
        })

        webhookSuccess = webhookResponse.ok

        if (!webhookSuccess) {
          console.warn('[Contact] n8n webhook failed:', webhookResponse.status)
        } else {
          console.log('[Contact] n8n webhook success')
        }
      } catch (webhookError) {
        console.warn('[Contact] n8n webhook error:', webhookError)
      }
    }

    // === SUBMISSION 2: WEB3FORMS BACKUP ===

    let web3formsSuccess = false

    if (context.env.WEB3FORMS_ACCESS_KEY) {
      try {
        const formData = new FormData()
        formData.append('access_key', context.env.WEB3FORMS_ACCESS_KEY)
        formData.append('name', fullName)
        formData.append('email', requestData.email)
        formData.append('message', requestData.message)
        formData.append('from_name', fullName)
        formData.append('subject', `New Contact Form Submission from ${fullName}`)

        const web3response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })

        const web3data = await web3response.json()
        web3formsSuccess = web3data.success === true

        if (!web3formsSuccess) {
          console.warn('[Contact] Web3Forms failed')
        } else {
          console.log('[Contact] Web3Forms success')
        }
      } catch (web3error) {
        console.warn('[Contact] Web3Forms error:', web3error)
      }
    }

    // === RESPONSE ===

    // Success if either submission worked
    if (webhookSuccess || web3formsSuccess) {
      return new Response(
        JSON.stringify({
          success: true,
          webhookSuccess,
          web3formsSuccess,
        } as ContactFormResponse),
        { headers: corsHeaders }
      )
    }

    // Both failed
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to send message. Please try again.',
      } as ContactFormResponse),
      { status: 500, headers: corsHeaders }
    )

  } catch (error) {
    console.error('[Contact] Function error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      } as ContactFormResponse),
      { status: 500, headers: corsHeaders }
    )
  }
}
