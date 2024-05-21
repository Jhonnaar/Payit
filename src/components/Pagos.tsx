import { useEffect, useState } from "react";
import Pago from "./Pago";

interface Props {
    totalPrice:number;
}
interface Pago {
  id:number;
  name:string;
  value:number;
  percentage:number;
  date:string;
}
function Pagos({totalPrice}:Props) {
  const getDate = () => {
    const date = new Date()
    const day = date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
    const month = (date.getMonth()+1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
    return day+"/"+month+"/"+date.getFullYear()
  }
  const currency = "USD"
  const [pagos, setPagos] = useState<Pago[]>([{id:1, name:"Anticipo", value:totalPrice, percentage:100 ,date:getDate()}])
  const [editable, setEditable] = useState<boolean>(false)
  const percentageDivisor = (percentage:number):number[] => {
    if (percentage%2===0) {
      return [percentage/2,percentage/2]
    }else{
      return [Math.ceil(percentage/2),Math.floor(percentage/2)]
    }
  }
  const updatePayments = (newPayment:Pago, updatedPayment:Pago) =>{
    setPagos(prevPagos => {
      const updatedPayments = prevPagos.map((pago, index)=>{
        if (pago.id === updatedPayment.id) {
          updatedPayment.name = index > 0 ? `Pago ${index}` : `Anticipo`
          return updatedPayment
        }else {
          pago.name = index > 0 ? `Pago ${index}` : `Anticipo`
          return pago
        }
      })
      return [...updatedPayments, newPayment]
    })
  }
  const setNewPayment = (index:number) => {
    const newId = index + 1
    const newName = pagos.length < newId ? "Pago Final":`Pago ${newId-1}`
    const percentages = percentageDivisor(pagos[newId-2].percentage)
    const NewPercentage = percentages[1]
    const newValue = totalPrice * NewPercentage / 100
    const newDate = getDate()
    const previousPayment = pagos[newId-2]
    previousPayment.percentage = percentages[0]
    previousPayment.value = totalPrice * percentages[0] / 100
    const newPayment : Pago = {
      id:newId, 
      name:newName, 
      value:newValue, 
      percentage:NewPercentage, 
      date:newDate
    }
    updatePayments(newPayment, previousPayment)
  }
  const handlerPercentage = (id:number, action:string) => {
    setPagos(prevPagos => {
      const updatedPayments = prevPagos.map((pago, index)=>{
        if (action==="+") {
          switch (pago.id) {
            case (id>1?id-1:id+1):
              pago.percentage -= 1
              pago.value = totalPrice * pago.percentage / 100
              break;
            case id:
              pago.percentage += 1
              pago.value = totalPrice * pago.percentage / 100
              break
            default:
              break;
          }
        }else {
          switch (pago.id) {
            case (id>1?id-1:id+1):
              pago.percentage += 1
              pago.value = totalPrice * pago.percentage / 100
              break;
            case id:
              pago.percentage -= 1
              pago.value = totalPrice * pago.percentage / 100
              break
            default:
              break;
          }
        }
        return pago
      })
      return [...updatedPayments]
    })
  }
  return (
    <div className="bg-white shadow-sm rounded-lg grid grid-cols-1 divide-y divide-gray-100">
      <div className="p-6 flex justify-between">
        <div className="h-fit flex my-auto">
          <h1 className="text-[#FF7A66] text-2xl leading-5 font-semibold">Pagos</h1>
          <img src="/src/assets/downArrowIcon.png" alt="Down arrow icon" className="w-6 aspect-square my-auto"/>
        </div>
        <div className="flex gap-6 my-auto">
          <button onClick={()=>{setEditable(!editable)}} className={`h-fit my-auto px-3 py-2 flex rounded-[5px] ${editable?"bg-[#FC4024]":""} transition-colors duration-500`}>
            {editable ? (
              <>
                <p className="text-white text-base leading-5 font-semibold">Guardar</p>
              </>
            ):(
              <>
                <p className="text-[#FF7A66] text-base leading-5 font-semibold">Editar</p>
                <img src="/src/assets/pencilIcon.png" alt="Pencil icon" className="w-5 aspect-square my-auto"/>
              </>
            )}
          </button>
          <p className="text-gray-400 text-xl font-normal my-auto">Por Cobrar <span className="text-gray-900 font-semibold">{totalPrice+" "+currency}</span></p>
        </div>
      </div>
      <div className="w-full h-fit p-6 flex gap-[72px]">
        {
          pagos.map((pago, index)=>{
            return (
              <div key={index} className="flex">
                <Pago editable={editable} id={pago.id} name={pago.name} value={pago.value} percentage={pago.percentage} date={pago.date} currency={currency} handlerPercentageBus={handlerPercentage}></Pago>
                <button onClick={()=>{setNewPayment(index+1)}} className="w-12 h-12 border-[3px] border-white rounded-full flex group relative">
                  <div className="bg-gray-200 absolute h-1 w-full top-1/2 -left-[90%] opacity-0 group-hover:opacity-100 -translate-x-[220%] group-hover:translate-x-[0%] transition duration-300"></div>
                  <div className="bg-gray-200 w-9 aspect-square rounded-full my-auto mx-auto grid opacity-0 group-hover:opacity-100 -translate-x-[220%] group-hover:translate-x-[0%] transition duration-300">
                    <img src="/src/assets/mediumPlusIcon.png" alt="Plus icon" className="w-[18px] aspect-square m-auto"/>
                  </div>
                </button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Pagos