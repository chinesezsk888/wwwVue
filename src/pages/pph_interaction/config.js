let apiUrl = ''
if (process.env.VUE_APP_ENV == 'development') {
  apiUrl = 'http://localhost:3000/pyq'
} else if (process.env.VUE_APP_ENV == 'buildfortest') {
  apiUrl = 'userDynamicList.jsp'
} else if (process.env.VUE_APP_ENV == 'buildforprod') {
  apiUrl = 'userDynamicList.jsp'
}
export {
  apiUrl
}
