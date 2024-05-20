import { useState } from "react";
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
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
  }
  const currency = "USD"
  const [pagos, setPagos] = useState<Pago[]>([{id:1, name:"Anticipo", value:totalPrice, percentage:100 ,date:getDate()}])
  const [editable, setEditable] = useState<boolean>(false)

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
      <div className="w-full h-fit p-6 flex justify-between">
        {
          pagos.map((pago)=>{
            return <Pago editable={editable} id={pago.id} name={pago.name} value={pago.value} percentage={pago.percentage} date={pago.date} currency={currency}></Pago>
          })
        }
      </div>
    </div>
  )
}

export default Pagos
