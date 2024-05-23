import { useState } from "react";
import Pago from "./Pago";
import { getActualDate } from "../scripts/dateFuntions";

interface Props {
    totalPrice:number;
}
export interface Payment {
  id:number;
  name:string;
  value:number;
  percentage:number;
  date:string;
  isPaid:boolean;
  paymentMethod?:string;
}
let baseId = 1
function Pagos({totalPrice}:Props) {
  const generateId = () : number => {
    baseId++
    return baseId
  }
  const currency = "USD"
  const [pagos, setPagos] = useState<Payment[]>([{id:1, name:"Anticipo", value:totalPrice, percentage:100 ,date:getActualDate(), isPaid:false}])
  const [editable, setEditable] = useState<boolean>(false)
  
  
  const percentageDivisor = (percentage:number):number[] => {
    if (percentage%2===0) {
      return [percentage/2,percentage/2]
    }else{
      return [Math.ceil(percentage/2),Math.floor(percentage/2)]
    }
  }

  const updatePayments = (position:number, newPayment:Payment, updatedPayment:Payment) =>{
    //Los estados de tipo array de objetos, los manejo de esta forma dado que de hacerse directamente, puede ocacionar comportamientos inesperados y difíciles de depurar
    setPagos(prevPagos => {
      const newPagos = [...prevPagos]
      newPagos.splice(position, 0, newPayment) //Utilicé el splice para poder agregar pagos en cualquier posición del array
      const updatedPayments = newPagos.map((pago, index)=>{
        if (pago.id === updatedPayment.id) {
          updatedPayment.name = index > 0 ? index < newPagos.length-1 ? `Pago ${index}` : "Pago Final" : `Anticipo`
          return updatedPayment
        }else {
          pago.name = index > 0 ? index < newPagos.length-1 ? `Pago ${index}` : "Pago Final" : `Anticipo`
          return pago
        }
      })
      return updatedPayments
    })
  }

  const setNewPayment = (index:number) => {
    const newId = generateId()
    const newName = "Pago final"
    const previousPayment = index===0?pagos[index]:pagos[index-1].isPaid?pagos[index]:pagos[index-1]
    const percentages = percentageDivisor(previousPayment.percentage)
    const NewPercentage = percentages[1]
    const newValue = totalPrice * NewPercentage / 100
    const newDate = getActualDate()
    previousPayment.percentage = percentages[0]
    previousPayment.value = totalPrice * percentages[0] / 100
    const newPayment : Payment = {
      id:newId, 
      name:newName, 
      value:newValue, 
      percentage:NewPercentage, 
      date:newDate,
      isPaid:false
    }
    updatePayments(index, newPayment, previousPayment)
  }

  const getNewPercentages = (position:number, action:string, notPaids:Payment[]) => {
    let minusPercentage:number
    let plusPercentage:number
    if (action==="+") {
      if (position===0) {
        if (notPaids[position+1].percentage - 1 >= 0) {
          plusPercentage = notPaids[position].percentage + 1
          minusPercentage = notPaids[position+1].percentage - 1
        }else {
          plusPercentage = notPaids[position].percentage
          minusPercentage = notPaids[position+1].percentage
        }
      }else {
        if (notPaids[position-1].percentage - 1 >= 0) {
          plusPercentage = notPaids[position].percentage + 1
          minusPercentage = notPaids[position-1].percentage - 1
        }else {
          plusPercentage = notPaids[position].percentage
          minusPercentage = notPaids[position-1].percentage
        }
      }
    }else {
      if (position===0) {
        if (notPaids[position].percentage - 1 >= 0) {
          plusPercentage = notPaids[position].percentage - 1
          minusPercentage = notPaids[position+1].percentage + 1
        }else {
          plusPercentage = notPaids[position].percentage
          minusPercentage = notPaids[position+1].percentage
        }
      }else {
        if (notPaids[position].percentage - 1 >= 0) {
          plusPercentage = notPaids[position].percentage - 1
          minusPercentage = notPaids[position-1].percentage + 1
        }else {
          plusPercentage = notPaids[position].percentage
          minusPercentage = notPaids[position-1].percentage
        }
      }
    }
    return {minusPercentage, plusPercentage}
  }

  const updatePercentages = (position:number, minusPercentage:number, plusPercentage:number, paids:Payment[], notPaids:Payment[]) => {
    setPagos(() => {
      const updatedNotPaids = notPaids.map((pago, index)=>{
        switch (index) {
          case (position>0?position-1:position+1):
            pago.percentage = minusPercentage
            pago.value = totalPrice * pago.percentage / 100
            break;
          case position:
            pago.percentage = plusPercentage
            pago.value = totalPrice * pago.percentage / 100
            break
          default:
            break;
        }
        return pago
      })

      return [...paids, ...updatedNotPaids]
    })
  }

  const handlerPercentage = (position:number, action:string) => {
    const paids = pagos.filter(pago=>pago.isPaid)
    const notPaids = pagos.filter(pago=>!pago.isPaid)
    if (notPaids.length>1) {
      position -= paids.length
      const {minusPercentage, plusPercentage} = getNewPercentages(position, action, notPaids)
      updatePercentages(position, minusPercentage, plusPercentage, paids, notPaids)
    }
  }

  const completePayment = (id:number, selectedPaymentMethod:string) => {
    setPagos(prevPagos => {
      const updatedPayments = prevPagos.map((pago)=>{
        if (pago.id === id) {
          pago.isPaid = true
          pago.paymentMethod = selectedPaymentMethod
          pago.date = getActualDate()
        }
        return pago
      })
      return updatedPayments
    })
  }

  const removePayment = (id:number) => {
    if (pagos.length>1) {
      setPagos(prevPagos => {
        let toUpdatePaymentIndex : number
        const updatedPayments = prevPagos.filter((pago, index)=>{
          if (pago.id!==id) {
            if (toUpdatePaymentIndex===index) {
              pago.percentage += pagos[index - 1].percentage
              pago.value = totalPrice * pago.percentage / 100
            }
            return pago
          }else {
            toUpdatePaymentIndex = index + 1
          }
        })
        return updatedPayments
      })
    }
  }

  const updateDate = (id:number, date:string) => {
    setPagos(prevPagos => {
      const updatedPayments = prevPagos.map((pago)=>{
        if (pago.id === id) {
          pago.date = date
        }
        return pago
      })

      return updatedPayments
    })
  }

  return (
    <div className="bg-white shadow-sm rounded-lg grid grid-cols-1 divide-y divide-gray-100">
      <div className="p-6 flex justify-between">
        <div className="h-fit flex my-auto">
          <h1 className="text-[#FF7A66] text-2xl leading-5 font-semibold">Pagos</h1>
          <img src="/assets/downArrowIcon.png" alt="Down arrow icon" className="w-6 aspect-square my-auto"/>
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
                <img src="/assets/pencilIcon.png" alt="Pencil icon" className="w-5 aspect-square my-auto"/>
              </>
            )}
          </button>
          <p className="text-gray-400 text-xl font-normal my-auto">Por Cobrar <span className="text-gray-900 font-semibold">{totalPrice+" "+currency}</span></p>
        </div>
      </div>
      <div className="w-full h-fit p-6 pl-4 flex gap-[66px] overflow-x-auto">
        {
          pagos.map((pago, index)=>{
            return (
              <div key={index} className="w-fit flex">
                <button onClick={()=>{setNewPayment(0)}} className={`w-12 h-12 -mr-4 border-[3px] border-white rounded-full group relative ${index===0?"flex":"hidden"} ${pago.isPaid?"pointer-events-none":""}`}>
                  <div className={`bg-gray-200 absolute h-1 w-full top-1/2 -right-[50%] pointer-events-none opacity-0 group-hover:opacity-100 translate-x-[220%] group-hover:-translate-x-[0%] transition duration-300`}></div>
                  <div className={`bg-gray-200 w-9 aspect-square rounded-full my-auto grid pointer-events-none opacity-0 group-hover:opacity-100 translate-x-[220%] group-hover:-translate-x-[0%] transition duration-300`}>
                    <img src="/assets/mediumPlusIcon.png" alt="Plus icon" className="w-[18px] aspect-square m-auto"/>
                  </div>
                </button>
                <Pago editable={editable} position={index} pago={pago} currency={currency} isPayable={index===0||pagos[index-1]?.isPaid} handlerPercentageBus={handlerPercentage} completePaymentBus={completePayment} removePaymentBus={removePayment} updateDateBus={updateDate}></Pago>
                <button onClick={()=>{setNewPayment(index+1)}} className={`w-12 h-12 border-[3px] border-white rounded-full flex group relative ${index===pagos.length-1?"":"ml-[25%]"} ${pago.isPaid?index+1<pagos.length?pagos[index+1].isPaid?"pointer-events-none":"":"pointer-events-none":""}`}>
                  <div className={`bg-gray-200 absolute h-1 w-full top-1/2 -left-[90%] grid grid-cols-2 transition ${index===pagos.length-1?"pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-[220%] group-hover:translate-x-[0%] duration-300":"scale-x-[600%] translate-x-[90%] duration-500"}`}>
                    <div className={`col-span-1 transition-colors duration-300 ${pago.isPaid&&"bg-green-600"}`}></div>
                    {
                      index + 1 < pagos.length && (
                        <div className={`col-span-1 transition-colors duration-300 ${pagos[index+1].isPaid?"bg-green-600":pago.isPaid?"bg-[#FC4024]":""}`}></div>
                      )
                    }
                  </div>
                  <div className={`bg-gray-200 w-9 aspect-square rounded-full my-auto grid pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-[220%] group-hover:translate-x-[0%] transition duration-300`}>
                    <img src="/assets/mediumPlusIcon.png" alt="Plus icon" className="w-[18px] aspect-square m-auto"/>
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
