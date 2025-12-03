export interface ContactInfo {
  company: {
    name: string
    brand: string
    product: string
  }
  email: {
    primary: string
    responseTime: string
  }
  phone: {
    number: string
    whatsapp: boolean
    hours: string
    timezone: string
  }
  website: {
    main: string
    docs: string
    status: string
  }
  supportHours: {
    days: string
    time: string
    timezone: string
    closed: string
  }
  emergency: {
    available: boolean
    access: string
    sla: string
  }
}

export const contactInfo: ContactInfo = {
  company: {
    name: "TEOS Egypt / Elmahrosa",
    brand: "Elmahrosa",
    product: "TEOS Bankchain",
  },
  email: {
    primary: "ayman@teosegypt.com",
    responseTime: "Within 4 business hours",
  },
  phone: {
    number: "+201006167293",
    whatsapp: true,
    hours: "Sunday - Thursday, 9:00 AM - 5:00 PM",
    timezone: "Cairo Time (GMT+2)",
  },
  website: {
    main: "https://bankchain.teosegypt.com",
    docs: "https://bankchain.teosegypt.com/docs",
    status: "https://status.bankchain.teosegypt.com",
  },
  supportHours: {
    days: "Sunday - Thursday",
    time: "9:00 AM - 5:00 PM",
    timezone: "Cairo Time (GMT+2)",
    closed: "Friday & Saturday (Weekend), Egyptian Public Holidays",
  },
  emergency: {
    available: true,
    access: "Bank Admins only - contact via primary email",
    sla: "Response within 30 minutes for P1 incidents",
  },
}

export function getContactInfo(): ContactInfo {
  return contactInfo
}

export function formatPhoneNumber(includeWhatsApp = false): string {
  const phone = contactInfo.phone.number
  if (includeWhatsApp && contactInfo.phone.whatsapp) {
    return `${phone} (WhatsApp available)`
  }
  return phone
}

export function formatSupportHours(language: "en" | "ar" = "en"): string {
  if (language === "ar") {
    return `الأحد - الخميس، 9 صباحاً - 5 مساءً (توقيت القاهرة)`
  }
  return `${contactInfo.supportHours.days}, ${contactInfo.supportHours.time} ${contactInfo.supportHours.timezone}`
}

export function getContactMessage(language: "en" | "ar" = "en"): string {
  const info = contactInfo

  if (language === "ar") {
    return `يمكنك التواصل مع فريق الدعم:\n\n📧 البريد: ${info.email.primary}\n📱 واتساب: ${info.phone.number}\n🌐 الموقع: ${info.website.main}\n⏰ الساعات: ${formatSupportHours("ar")}\n\nللمسائل العاجلة، يمكن لمسؤولي البنك الاتصال بخط الطوارئ.`
  }

  return `You can reach our support team:\n\n📧 Email: ${info.email.primary}\n📱 WhatsApp: ${info.phone.number}\n🌐 Website: ${info.website.main}\n⏰ Hours: ${formatSupportHours("en")}\n\nFor urgent issues, bank admins can call the emergency hotline.`
}
