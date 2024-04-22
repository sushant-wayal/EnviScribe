import { Link } from 'react-router-dom'
import { Lock, LogIn, Menu, School2Icon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface AuthNavbarProps {}

const AuthNavbar : React.FC<AuthNavbarProps> = () => {
  return (
    <div className='bg-[#302f2f] sticky top-0 pt-5 h-auto z-[1] mb-5 shadow-lg shadow-[#302f2f]/70'>
      <div className='sticky top-5 mx-2 mb-10 rounded-full w-[568px] py-4 px-4 hidden md:flex justify-between items-center border-0 border-black border-solid z-[1001] bg-green-600 text-white left-full lg:left-1/2 lg:-translate-x-1/2'>
        <Link className='hover:underline' to="/login"><div className='flex gap-3'><LogIn/><p className='text-xl'>Login</p></div></Link>
        <Link className='hover:underline' to="/signup"><div className='flex gap-3'><Lock/><p className='text-xl'>Sign Up</p></div></Link>
        <Link className='hover:underline' to="/"><div className='flex gap-3'><School2Icon/><p className='text-xl'>Register Institute</p></div></Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className='md:hidden sticky top-5 mb-10 left-[93%]'>
          <DropdownMenuLabel><Menu color='green' size={30}/></DropdownMenuLabel>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='hover:bg-green-300'>
            <Link className='hover:underline' to="/login"><div className='flex gap-3'><LogIn size={20}/><p>Login</p></div></Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:bg-green-300'>
            <Link className='hover:underline' to="/signup"><div className='flex gap-3'><Lock size={20}/><p>Sign Up</p></div></Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:bg-green-300'>
            <Link className='hover:underline' to="/"><div className='flex gap-3'><School2Icon size={20}/><p>Register Institute</p></div></Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default AuthNavbar