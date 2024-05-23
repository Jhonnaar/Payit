import Pagos from "./components/Pagos"
import { removeDataFromLocalStorage } from "./scripts/dbConection"

function App() {
  const handleResetApp = () => {
    removeDataFromLocalStorage()
    window.location.reload()
  }
  return (
    <div className="w-full h-screen bg-gray-500 grid grid-cols-12">
      <button onClick={()=>{handleResetApp()}} className="bg-[#FC4024] absolute top-4 left-1/4 px-3 py-2 rounded-[5px] text-gray-50 text-sm font-semibold">Reset app</button>
      <div className="col-start-3 col-end-11 my-auto">
        <Pagos totalPrice={182}></Pagos>
      </div>
    </div>
  )
}

export default App
