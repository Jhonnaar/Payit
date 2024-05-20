import { useState } from "react";

interface Props {
  editable:boolean;
  id:number;
  name:string;
  value:number;
  percentage:number;
  date:string;
  currency:string;
}
function Pago({editable, id, name, value, percentage, date, currency}:Props) {
  const [inputName, setInputName] = useState<string>(name)
  const [inputValue, setInputValue] = useState<number>(value)
  const [inputPercentage, setInputPercentage] = useState<number>(percentage)
  return (
    <div className="w-fit h-fit grid">
      <div className="w-12 aspect-square mx-auto border-[3px] border-[#FC4024] rounded-full"></div>
      <input 
        type="text"
        disabled={!editable}
        id="inputName"
        value={inputName} 
        onChange={(e)=>setInputName(e.target.value)}
        className={`bg-white text-gray-900 text-xl font-bold w-28 h-fit px-2 mx-auto mt-2 ${editable?"border-[0.5px]":"text-center"} border-gray-400 rounded-[3px] focus:outline-none`}
      />
      <div className={`flex mx-auto pl-2 ${editable?"w-full border-[0.5px]":"w-fit"} border-gray-400`}>
        <p className="text-gray-900 text-sm font-semibold">{value}</p>
        <p className={`text-sm font-semibold ${editable?"text-gray-400 translate-x-[150%] transition duration-500":"text-gray-900"}`}>{currency}<span hidden={editable} className="font-normal">({percentage}%)</span></p>
      </div>
      <p className="text-sm mx-auto">{date}</p>
    </div>
  )
}

export default Pago
