import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

interface NavbarProps {}

const Navbar : React.FC<NavbarProps> = () => {
  return (
    <div className='sticky top-2 mx-2 mb-10 rounded-full w-[calc(100vw-16px)] py-2 px-4 flex justify-between items-center border-2 border-black border-solid'>
      <p>EnviroLogger</p>
      <div className='flex gap-20 items-center'>
        <Link to="/home">Home</Link>
        <div className='relative px-5 py-2 rounded-full border-2 border-solid border-black'>
          <input className='w-full h-full p-2 ml-3 focus:outline-none' type="text" placeholder="Search" />
          <Search className='absolute left-2 top-1/2 -translate-y-1/2' />
        </div>
      </div>
    </div>
  )
}

export default Navbar