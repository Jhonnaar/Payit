import { useState } from "react"
import CustomSelect from "./CustomSelect"

interface Props {
  savePaymentMethodBus:(selectedPaymentMethod:string)=>void;
  deletePaymentBus:()=>void;
  hidePaymentModalBus:()=>void;
}
function PaymentModal({savePaymentMethodBus, deletePaymentBus, hidePaymentModalBus}:Props) {
  const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo")

  const selectPaymentMethod = (selectedPaymentMethod:string) => {
    setPaymentMethod(selectedPaymentMethod)
  }
  const handleSaveButton = () => {
    savePaymentMethodBus(paymentMethod)
    hidePaymentModalBus()
  }
  const handleDeleteButton = () => {
    deletePaymentBus()
    hidePaymentModalBus()
  }
  return (
    <div className="absolute w-full h-full top-0 left-0 grid z-30">
      <div onClick={()=>{hidePaymentModalBus()}} className="absolute w-full h-full top-0 left-0 bg-gray-600/35 blur-lg"></div>
      <div className="relative w-[85%] md:w-[55%] lg:w-[45%] xl:w-[35%] p-6 bg-white shadow-xl rounded-lg overflow-y-visible m-auto">
          <button onClick={()=>{hidePaymentModalBus()}} className="w-fit h-fit absolute right-1 top-1">
            <img src="/assets/exitIcon.png" alt="Exit icon" className="w-5 aspect-square"/>
          </button>
        <div className="grid grid-cols-7">
          <h2 className="text-black text-2xl font-semibold mb-4 col-span-7">Pagar</h2>
          <p className="text-gray-900 text-base font-normal mb-6 col-span-7">Selecciona método de pago.</p>
          <div className="col-span-3 pb-3"><CustomSelect selectPaymentMethodBus={selectPaymentMethod}></CustomSelect></div>
          <div className="col-start-4 col-span-4 flex justify-end items-end gap-x-5">
            <button onClick={()=>{handleDeleteButton()}}><img src="/assets/binIcon.png" alt="Bin icon" className="w-6 h-6 hover:scale-110 transition duration-300"/></button>
            <button onClick={()=>{handleSaveButton()}} className="bg-[#FC4024] w-fit h-fit px-3 py-2 rounded-[5px] text-gray-50 text-xs font-semibold hover:scale-110 transition duration-300">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
