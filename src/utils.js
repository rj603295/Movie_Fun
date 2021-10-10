const TOKEN_NAME = 'token'
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token)
}
export const getAuthToken = () => localStorage.getItem(TOKEN_NAME)

export const getDate = () => {
  let Today = new Date()
  const doubleMonth = ["10", "11", "12"]
  const oddDate = ["1", "2", "3" , "4", "5", "6", "7", "8", "9"]
  let month = ""
  let day = ""
  if(!doubleMonth.includes((Today.getMonth()+1).toString())){
    month = "0" + (Today.getMonth()+1).toString()
  } else {
    month = (Today.getMonth()+1).toString()
  }
  if(oddDate.includes((Today.getDate()).toString())){
    day = "0" + (Today.getDate()).toString()
  } else {
    day = (Today.getDate()).toString()
  }
  return Today.getFullYear().toString() + month + day
}
export const getCreatedAt = () => {
  let Today = new Date()
  return Today.getTime()
}