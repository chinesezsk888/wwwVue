let apiUrl = ''
if (process.env.VUE_APP_ENV === 'development') {
  // apiUrl = 'http://10.10.4.146:8892/wap/v3_new/jsp/user_suggestions_data.jsp?interactionType=1'
  apiUrl = 'http://localhost:3000/localDev'
} else if (process.env.VUE_APP_ENV === 'buildfortest') {
  apiUrl = 'user_suggestions_data.jsp?interactionType=1'
} else if (process.env.VUE_APP_ENV === 'buildforprod') {
  apiUrl = 'user_suggestions_data.jsp?interactionType=1'
}

export {
  apiUrl
}
