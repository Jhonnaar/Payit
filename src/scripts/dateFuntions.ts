//Propociona un archivo centralizado para el manejo del formato de las fechas, de facil y claro acceso desde cualquier componente
enum Months {
  Ene = 1,
  Feb,
  Mar,
  Abr,
  May,
  Jun,
  Jul,
  Ago,
  Sep,
  Oct,
  Nov,
  Dic
}

const getActualDate = () => {
  const date = new Date()
  const day = date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  const month = (date.getMonth()+1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  return day+"/"+month+"/"+date.getFullYear()
}

//Es necesario para el formato por defecto del input date
const formatDate = (date:string) : string => {
  return date.split("/").reverse().join("-")
}

const unFormatDate = (date:string) : string => {
  return date.split("-").reverse().join("/")
}

const extendDate = (date:string) : string => {
  const splitedDate = date.split("/")
  return `${splitedDate[0]} ${Months[parseInt(splitedDate[1])]}, ${splitedDate[2]}`
}

export { getActualDate, formatDate, unFormatDate, extendDate }