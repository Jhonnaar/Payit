
const setCookie = (key:string, value:number, days:number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expiracion = "expires=" + date.toUTCString();
  document.cookie = `${key}=${value}; ${expiracion}; path=/`;
}

const getFromCookie = (key:string) : number => {
  const decodedCookies = decodeURIComponent(document.cookie)
  const cookies = decodedCookies.replace(/\s+/g, '').split(";")
  const matchedCookie = cookies.find(cookie=>cookie.split("=")[0]===key)
  if (matchedCookie) {
    return parseInt(matchedCookie.split("=")[1])
  }else {
    setCookie(key, 1, 1)
    return 1
  }
}

const generateId = () : number => {
  const idCookieValue : number = getFromCookie("PAYIT_ID_COUNTER")
  setCookie("PAYIT_ID_COUNTER", idCookieValue + 1, 1)
  return idCookieValue + 1
}

export { generateId, getFromCookie, setCookie }