import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import esCommon from './es/common.json'
import esDashboard from './es/dashboard.json'
import enCommon from './en/common.json'
import enDashboard from './en/dashboard.json'

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('language') ?? 'es',
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: {
    es: { common: esCommon, dashboard: esDashboard },
    en: { common: enCommon, dashboard: enDashboard },
  },
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
