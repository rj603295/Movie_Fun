const TOKEN_NAME = 'token'
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token)
}
export const getAuthToken = () => localStorage.getItem(TOKEN_NAME)

export const getDate = () => {
  let Today = new Date()
  const doubleMonth = ["10", "11", "12"];
  let month = ""
  if(!doubleMonth.includes((Today.getMonth()+1).toString())){
    month = "0" + (Today.getMonth()+1).toString()
  } else {
    month = (Today.getMonth()+1).toString()
  }
  return Today.getFullYear().toString() + month + Today.getDate().toString()
}