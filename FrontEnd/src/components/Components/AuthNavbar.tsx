import { Link } from 'react-router-dom'
import { Lock, LogIn, School2Icon } from 'lucide-react'

interface AuthNavbarProps {}

const AuthNavbar : React.FC<AuthNavbarProps> = () => {
  return (
    <div className='sticky top-5 mx-2 mb-10 rounded-full w-[568px] py-4 px-4 flex justify-between items-center border-0 border-black border-solid z-[1001] bg-green-600 text-white left-1/2 -translate-x-1/2'>
      <Link to="/login"><div className='flex gap-3'><LogIn/><p className='text-xl'>Login</p></div></Link>
      <Link to="/signup"><div className='flex gap-3'><Lock/><p className='text-xl'>Sign Up</p></div></Link>
      <Link to="/"><div className='flex gap-3'><School2Icon/><p className='text-xl'>Register Institute</p></div></Link>
    </div>
  )
}

export default AuthNavbar