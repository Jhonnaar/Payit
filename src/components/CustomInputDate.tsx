import { useRef } from 'react';
import { formatDate, unFormatDate } from '../scripts/dateFuntions';

interface Props {
  currentDate:string;
  handlerDateStateBus:(date:string)=>void;
}

function CustomInputDate({currentDate, handlerDateStateBus}:Props) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const handleSelectDate = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker()
    }
  }

  return (
    <div className='relative'>
      <button onClick={handleSelectDate}>
        <img src="/assets/calendarIcon.png" alt="Calendar icon" className="w-4 aspect-square"/>
      </button>
      <input 
        type="date"
        ref={dateInputRef}
        min={formatDate(currentDate)}
        onChange={(e)=>{handlerDateStateBus(unFormatDate(e.target.value))}}
        className="absolute opacity-0 pointer-events-none"
      />
    </div>
  )
}

export default CustomInputDate
