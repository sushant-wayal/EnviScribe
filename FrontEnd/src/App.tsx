import { Outlet } from "react-router-dom"
import Footer from "./components/Components/Footer"
import { Toaster } from "./components/ui/sonner"
import { name } from "./constants"

interface AppProps {}

const App : React.FC<AppProps> = () => {
  return (
    <div className="bg-[#302f2f]">
      <img className='fixed left-4 top-8 w-40 z-[1002]' src='../logo.png' alt={name}/>
      <Toaster
        richColors={true}
        theme="light"
        position="top-center"
      />
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App