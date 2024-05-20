import Pagos from "./components/Pagos"

function App() {
  return (
    <div className="w-full h-screen bg-gray-500 grid grid-cols-12">
      <div className="col-start-3 col-end-11 my-auto">
        <Pagos totalPrice={182}></Pagos>
      </div>
    </div>
  )
}

export default App
