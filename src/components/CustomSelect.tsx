import {  useState, useRef, useEffect } from "react"

interface Props {
  selectPaymentMethodBus:(selectedPaymentMethod:string)=>void
}
function CustomSelect({selectPaymentMethodBus}:Props) {
  const options : string[] = ["Efectivo", "Tarjeta"]
  const [selectedMethod, setSelectedMethod] = useState<string>(options[0])
  const selectRef = useRef<HTMLInputElement>(null)

  const showOptions = () => {
    selectRef.current?.classList.remove("overflow-y-hidden")
  }
  const hideOptions = () => {
    selectRef.current?.classList.add("overflow-y-hidden")
  }
  useEffect(()=>{
    selectPaymentMethodBus(selectedMethod)
  },[selectedMethod])
  return (
    <div ref={selectRef} className="relative overflow-y-hidden">
      <p className="text-gray-600 text-sm font-normal col-span-7">Estado</p>
      <div onClick={()=>{showOptions()}} className="bg-white border border-gray-300 hover:border-[#FF7A66] rounded-[4px] pl-4 pr-2 py-[10px] text-gray-900 text-sm font-normal flex justify-between transition">
        <p>{selectedMethod}</p>
        <img src="/assets/blackDownArrowIcon.png" alt="Down arrow icon" />
      </div>
      <div className="absolute w-[65%] bg-white border-[0.5px] border-gray-300 rounded-[5px] py-4 grid gap-y-2">
        {
          options.map((option, index)=>{
            return (
              <p 
                onClick={()=>{
                  setSelectedMethod(option)
                  hideOptions()
                }} 
                key={index} 
                className="text-gray-400 hover:text-[#FF7A66] hover:bg-[#FBF0E8] px-4 py-1 cursor-pointer transition-colors">{option}
              </p>
            )
          })
        }
      </div>
    </div>
  )
}

export default CustomSelect
