import { useEffect, useState } from "react";
import CustomInputDate from "./CustomInputDate";
import type { Payment } from "./Pagos";
import PaymentModal from "./PaymentModal";
import { extendDate } from "../scripts/dateFuntions";

interface Props {
  editable:boolean;
  pago:Payment;
  position:number;
  currency:string;
  isPayable:boolean;
  handlerPercentageBus:(position:number, action:string)=>void;
  completePaymentBus:(id:number, paymentMethod:string)=>void;
  removePaymentBus:(id:number)=>void;
  updateDateBus:(id:number, date:string)=>void;
}
function Pago({editable, position, pago:{id, name, value, percentage, date, isPaid, paymentMethod}, currency, isPayable, handlerPercentageBus, completePaymentBus, removePaymentBus, updateDateBus}:Props) {
  const [inputName, setInputName] = useState<string>(name)
  const [inputValue, setInputValue] = useState<number>(value)
  const [inputPercentage, setInputPercentage] = useState<number>(percentage)
  const [inputDate,setInputDate] = useState<string>(date)
  const [isPaymentModal, setIsPaymentModal] = useState<boolean>(false)
  editable = !isPaid && editable
  const handlerDateState = (newDate:string) => {
    updateDateBus(id, newDate)
    setInputDate(newDate)
  }
  useEffect(()=>{
    setInputName(name)
    setInputValue(value)
    setInputPercentage(percentage)
    setInputDate(date)
  },[name, value, percentage, date, paymentMethod, isPaid])
  const savePaymentMethod = (selectedPaymentMethod:string) => {
    completePaymentBus(id, selectedPaymentMethod)
  }
  const deletePayment = () => {
    removePaymentBus(id)
  }
  const hidePaymentModal = () => {
    setIsPaymentModal(false)
  }
  const showPaymentModal = () => {
    setIsPaymentModal(true)
  }
  
  return (
    <div className="w-fit h-fit grid gap-y-2">
      {
        isPaymentModal && (
          <PaymentModal savePaymentMethodBus={savePaymentMethod} deletePaymentBus={deletePayment} hidePaymentModalBus={hidePaymentModal}></PaymentModal>
        )
      }
      <button onClick={()=>{showPaymentModal()}} className={`w-12 aspect-square mx-auto border-[3px] ${(editable)?"bg-gray-50 border-[#FC4024] pointer-events-none":isPaid?"bg-green-500 border-green-500 pointer-events-none":isPayable?"bg-gray-200 border-[#FC4024]":"bg-gray-200 border-gray-200 pointer-events-none"} rounded-full grid group hover:bg-slate-50 hover:border-[#FC4024] transition z-10`}>
        {
          isPaid ? (
            <img src="/src/assets/partyIcon.png" alt="Party Icon" className="w-6 h-6 my-auto mx-auto"/>
          ) : (
            <img src="/src/assets/pencilIcon.png" alt="Pencil icon" className="w-5 aspect-square my-auto mx-auto opacity-0 group-hover:opacity-100 transition"/>
          )
        }
      </button>
      <input 
        type="text"
        disabled={!editable}
        id={`inputName${position}`}
        value={inputName} 
        onChange={(e)=>setInputName(e.target.value)}
        className={`bg-white text-gray-900 text-xl font-bold w-28 h-fit px-2 mx-auto ${editable?"border-[0.5px]":"text-center"} border-gray-400 rounded-[3px] focus:outline-none`}
      />
      <div className={`flex mx-auto pl-2 ${editable?"w-full border-[0.5px]":"w-fit gap-x-1"} border-gray-400`}>
        <p className="text-gray-900 text-sm font-semibold">{inputValue%1===0?inputValue:inputValue.toFixed(1)}<span hidden={inputValue%1!==0} className="opacity-0">{editable?".7":""}</span></p>
        <p className={`text-sm font-semibold ${editable?"text-gray-400 translate-x-[150%] transition duration-500":"text-gray-900"}`}>{currency}<span hidden={editable} className="font-normal"> ({inputPercentage}%)</span></p>
      </div>
      <div className={`mx-auto gap-x-2 ${editable?"flex":"hidden"}`}>
        <button onClick={()=>{handlerPercentageBus(position,"-")}} className="bg-gray-50 w-6 aspect-square rounded-full border-[0.58px] border-[#FF7A66] hover:border-[#FC4024] hover:scale-110 transition duration-200 grid">
          <img src="/src/assets/minusIcon.png" alt="Minus icon" className="w-3 aspect-square m-auto"/>
        </button>
        <p className="text-gray-900 text-sm font-normal my-auto">{inputPercentage}%</p>
        <button onClick={()=>{handlerPercentageBus(position,"+")}} className="bg-gray-50 w-6 aspect-square rounded-full border-[0.58px] border-[#FF7A66] hover:border-[#FC4024] hover:scale-110 transition duration-200 grid">
          <img src="/src/assets/plusIcon.png" alt="Plus icon" className="w-3 aspect-square m-auto"/>
        </button>
      </div>
      <div className="grid mx-auto">
        <p hidden={!editable} className="text-gray-400 text-sm font-normal my-auto">Vence</p>
        <div className="max-w-[130px] my-auto flex gap-x-2">
          <div hidden={!editable}><CustomInputDate currentDate={date} handlerDateStateBus={handlerDateState}></CustomInputDate></div>
          <p className={`text-gray-900 text-sm font-normal text-center ${isPaid&&"text-green-600"}`}><span hidden={!isPaid}>Pagado </span>{editable?inputDate:extendDate(inputDate)} <span hidden={!isPaid}>con {paymentMethod}</span></p>
        </div>
      </div>
    </div>
  )
}

export default Pago
