import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'

interface NavbarProps {}

const Navbar : React.FC<NavbarProps> = () => {
  return (
    <div className='sticky top-2 mx-2 mb-10 rounded-full w-[calc(100vw-16px)] py-2 px-4 flex justify-between items-center border-2 border-black border-solid z-[1001]'>
      <p>EnviroLogger</p>
      <div className='flex gap-20 items-center'>
        <Link to="/home">Home</Link>
        <div className='flex gap-1 justify-center items-center px-2 py-2'>
          <Search/>
          <Input placeholder='Search' />
        </div>
      </div>
    </div>
  )
}

export default Navbar