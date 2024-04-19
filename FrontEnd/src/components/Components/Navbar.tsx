import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import { Input } from '../ui/input'

interface NavbarProps {}

const Navbar : React.FC<NavbarProps> = () => {
  return (
    <div className='sticky top-5 mx-2 mb-10 rounded-full w-[568px] py-2 px-4 flex justify-between items-center border-0 border-black border-solid z-[1001] bg-green-600 text-white left-1/2 -translate-x-1/2'>
      <Link to="/home"><div className='flex gap-3'><Home/><p className='text-xl'>Home</p></div></Link>
      <div className='flex gap-1 justify-center items-center px-2 py-2'>
        <Search/>
        <Input placeholder='Search' className='placeholder:text-[#444444] rounded-full bg-white'/>
      </div>
    </div>
  )
}

export default Navbar