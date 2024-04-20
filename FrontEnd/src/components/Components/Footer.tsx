import { Link } from 'react-router-dom'

interface FooterProps {}

const Footer : React.FC<FooterProps> = () => {
  return (
    <div className='sticky top-2 mt-5 mx-2 pb-5'>
      <div className='rounded-xl sm:rounded-full w-[calc(100vw-16px)] py-2 px-4 flex flex-col md:flex-row justify-center gap-5 md:justify-between items-center z-[1001] bg-green-600 text-white'>
        <p>&copy; DP Group 43 | 2024</p>
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-20 items-center'>
          <Link className='hover:underline' to="/privacy">Privacy</Link>
          <Link className='hover:underline' to="/contact">Contact Us</Link>
          <Link className='hover:underline' to="/about">About Us</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer