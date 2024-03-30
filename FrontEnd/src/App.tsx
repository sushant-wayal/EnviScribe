import { Outlet } from "react-router-dom"

interface AppProps {}

const App : React.FC<AppProps> = () => {
  return (
    <Outlet/>
  )
}

export default App