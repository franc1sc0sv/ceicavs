import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import esCommon from './es/common.json'
import esDashboard from './es/dashboard.json'
import esAttendance from './es/attendance.json'
import esPeople from './es/people.json'
import esBlog from './es/blog.json'
import esTools from './es/tools.json'
import enCommon from './en/common.json'
import enDashboard from './en/dashboard.json'
import enAttendance from './en/attendance.json'
import enPeople from './en/people.json'
import enBlog from './en/blog.json'
import enTools from './en/tools.json'

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('language') ?? 'es',
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: {
    es: { common: esCommon, dashboard: esDashboard, attendance: esAttendance, people: esPeople, blog: esBlog, tools: esTools },
    en: { common: enCommon, dashboard: enDashboard, attendance: enAttendance, people: enPeople, blog: enBlog, tools: enTools },
  },
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
