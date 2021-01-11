
let apiUrl = ''
let calendarUrl = ''
if (process.env.VUE_APP_ENV === 'development') {
  apiUrl = 'http://10.10.4.70:8891/www/V1/pages/dailyTones.jsp?n='
  calendarUrl = 'http://10.10.4.70:8891/www/V1/pages/dailyTonesCalendar.jsp?dateStr='
} else if (process.env.VUE_APP_ENV === 'buildfortest') {
  apiUrl = '/DailyTones/Data/'
  calendarUrl = '/DailyTones/Calendar/'
} else if (process.env.VUE_APP_ENV === 'buildforprod') {
  apiUrl = '/DailyTones/Data/'
  calendarUrl = '/DailyTones/Calendar/'
}
function getUrlKey (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}
export {
  apiUrl,
  calendarUrl,
  getUrlKey
}
