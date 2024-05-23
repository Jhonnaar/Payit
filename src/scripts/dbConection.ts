import { Payment } from "../components/Pagos"
import { getActualDate } from "./dateFuntions"

const getDataFromLocalStorage = (totalPrice:number) : Payment[] => {
  const defaultPayment : Payment = {id:1, name:"Anticipo", value:totalPrice, percentage:100 ,date:getActualDate(), isPaid:false}
  const dataSaved = localStorage.getItem('pagos')
  if (dataSaved) {
    const pagos : Payment [] = JSON.parse(dataSaved)
    return pagos
  }else {
    return [defaultPayment]
  }

}

const saveDataToLocalStorage = (pagos:Payment[]) => {
  localStorage.setItem('pagos', JSON.stringify(pagos))
}

const removeDataFromLocalStorage = () => {
  localStorage.removeItem('pagos')
}

export { getDataFromLocalStorage, saveDataToLocalStorage, removeDataFromLocalStorage }