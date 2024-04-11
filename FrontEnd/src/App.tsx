import { Outlet } from "react-router-dom"
import Footer from "./components/Components/Footer"

interface AppProps {}

const App : React.FC<AppProps> = () => {
  return (
    <>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App