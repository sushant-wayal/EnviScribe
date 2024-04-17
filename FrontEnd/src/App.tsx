import { Outlet } from "react-router-dom"
import Footer from "./components/Components/Footer"
import { Toaster } from "./components/ui/sonner"

interface AppProps {}

const App : React.FC<AppProps> = () => {
  return (
    <>
      <Toaster
        richColors={true}
        theme="light"
        position="top-center"
      />
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App