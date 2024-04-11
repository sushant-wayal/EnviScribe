import { Link } from 'react-router-dom'

interface FooterProps {}

const Footer : React.FC<FooterProps> = () => {
  return (
    <div className='sticky top-2 mx-2 my-5 rounded-full w-[calc(100vw-16px)] py-2 px-4 flex justify-between items-center border-2 border-black border-solid z-[1001]'>
      <p>&copy; DP Group 43 | 2024</p>
      <div className='flex gap-20 items-center'>
        <Link to="/privacy">Privacy</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About Us</Link>
      </div>
    </div>
  )
}

export default Footer