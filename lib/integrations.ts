// Integration status checker
export const integrationStatus = {
  supabase: {
    connected: true,
    features: ["auth", "database", "realtime"],
    tables: ["profiles", "customers", "invoices", "estimates", "projects"],
  },
  email: {
    connected: !!process.env.SENDGRID_API_KEY,
    provider: "SendGrid",
    features: ["transactional", "marketing"],
  },
  payments: {
    connected: false,
    recommended: ["Stripe", "PayPal", "Square"],
  },
  storage: {
    connected: false,
    recommended: ["Vercel Blob", "Supabase Storage", "AWS S3"],
  },
  calendar: {
    connected: false,
    recommended: ["Google Calendar API", "Calendly"],
  },
  sms: {
    connected: false,
    recommended: ["Twilio", "AWS SNS"],
  },
  maps: {
    connected: false,
    recommended: ["Google Maps API", "Mapbox"],
  },
}

export function getIntegrationRecommendations() {
  const missing = Object.entries(integrationStatus)
    .filter(([key, status]) => !status.connected)
    .map(([key, status]) => ({
      name: key,
      priority: getPriority(key),
      options: status.recommended,
    }))

  return missing.sort((a, b) => b.priority - a.priority)
}

function getPriority(integration: string): number {
  const priorities = {
    payments: 10,
    email: 9,
    storage: 7,
    calendar: 6,
    sms: 5,
    maps: 4,
  }
  return priorities[integration as keyof typeof priorities] || 1
}
