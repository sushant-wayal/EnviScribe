import { Link, useNavigate } from 'react-router-dom'
import { Home, LogOutIcon, Menu, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { domain, tokenKey } from '@/constants'
import { useRef, useState } from 'react'
import axios from 'axios'
import Badge from './Badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface NavbarProps {}

const Navbar : React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem(tokenKey)
    navigate('/login')
  }
  const search = useRef<HTMLDivElement>(null);
  const [fetchedDevices, setFetchedDevices] = useState<{
    _id: string;
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
    sensors: number;
  }[]>([]);
  const fetchDevices = async (query : string) => {
    const { data : { data } } = await axios.get(`${domain}/api/v1/devices/?query=${query}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
      }
    });
    setFetchedDevices(data.map((device : any) => {
      const { _id, name, location, sensors } = device;
      return {
        _id,
        name,
        location,
        sensors: sensors.length,
      }
    }));
  };
  return (
    <div className='bg-[#302f2f] sticky top-0 pt-5  z-[1001] h-auto mb-5 shadow-lg shadow-[#302f2f]/70'>
      <div className='sticky top-5 mx-2 mb-5 rounded-full w-[568px] py-2 px-4 hidden md:flex justify-between items-center border-0 border-black border-solid bg-green-600 text-white left-full lg:left-1/2 lg:-translate-x-1/2'>
        <Link to="/home"><div className='flex gap-3'><Home/><p className='text-xl hover:underline'>Home</p></div></Link>
        <div className='flex gap-1 justify-center items-center px-2 py-2'>
          <Search/>
          <div>
            <Input onChange={(e) => {
              fetchDevices(e.target.value);
              if (e.target.value.length == 0) {
                search.current?.classList.add("hidden");
                search.current?.classList.remove("flex");
              }
            }} placeholder='Search' className='placeholder:text-[#444444] rounded-full bg-white text-[#222222]'/>
            <div className={`absolute top-[100%] w-2/3 -translate-x-1/2 left-1/2 max-h-[100px] flex flex-col border-black border-solid rounded bg-white  overflow-x-auto text-[#222222] ${fetchedDevices.length != 0 ? "border-2 p-2" : "h-0"}`} ref={search}>
              {fetchedDevices.map(device => {
                const { _id, name, location, sensors } = device;
                return (
                  <Link
                    key={_id}
                    to={`/device/${_id}`}
                    onClick={() => {
                      search.current?.classList.add("hidden");
                      search.current?.classList.remove("flex");
                    }}
                    className="hover:bg-green-400/50 p-1 text-[#222222] flex justify-between items-center"
                  >
                    <p className='text-lg'>{name}</p>
                    <div className='flex flex-col justify-between items-center text-white'>
                      <div className='flex justify-between items-center gap-1'>
                        <Badge content={location.latitude.toString()} className='h-5'/>
                        <Badge content={location.longitude.toString()} className='h-5'/>
                      </div>
                      <Badge content={`${sensors.toString()} sensors`} className='h-5 bg-gray-600/50 mt-1'/>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <Button variant="ghost" onClick={Logout} className='hover:bg-transparent hover:text-white hover:underline'>
          <LogOutIcon className='mr-2'/>
          <p className='text-xl'>Logout</p>
        </Button>
      </div>
      <div className='md:hidden z-[1001] sticky top-5 mb-10 right-0 flex flex-col-reverse items-end sm:flex-row sm:justify-end sm:items-center w-full'>
        <div className='flex gap-1 justify-center items-center px-2 py-2'>
          <Search color='green'/>
          <div>
            <Input onChange={(e) => {
              fetchDevices(e.target.value);
              if (e.target.value.length == 0) {
                search.current?.classList.add("hidden");
                search.current?.classList.remove("flex");
              }
            }} placeholder='Search' className='placeholder:text-[#444444] rounded-full bg-white text-[#222222]'/>
            <div className={`absolute top-[100%] w-full sm:w-3/4 md:w-2/3 right-0 md:-translate-x-1/2 md:left-1/2 max-h-[100px] flex flex-col border-black border-solid rounded bg-white  overflow-x-auto text-[#222222] z-[1002] ${fetchedDevices.length != 0 ? "border-2 p-2" : "h-0"}`} ref={search}>
              {fetchedDevices.map(device => {
                const { _id, name, location, sensors } = device;
                return (
                  <Link
                    key={_id}
                    to={`/device/${_id}`}
                    onClick={() => {
                      search.current?.classList.add("hidden");
                      search.current?.classList.remove("flex");
                    }}
                    className="hover:bg-green-400/50 p-1 text-[#222222] flex justify-between items-center"
                  >
                    <p className='text-lg'>{name}</p>
                    <div className='flex flex-col justify-between items-center text-white'>
                      <div className='flex justify-between items-center gap-1'>
                        <Badge content={location.latitude.toString()} className='h-5'/>
                        <Badge content={location.longitude.toString()} className='h-5'/>
                      </div>
                      <Badge content={`${sensors.toString()} sensors`} className='h-5 bg-gray-600/50 mt-1'/>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DropdownMenuLabel><Menu color='green' size={30}/></DropdownMenuLabel>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='z-[1002]'>
            <DropdownMenuItem className='hover:bg-green-300'>
              <Link to="/home"><div className='flex gap-3'><Home size={20}/><p className='hover:underline'>Home</p></div></Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='hover:bg-green-300'>
              <Button variant="ghost" onClick={Logout} className='hover:bg-transparent hover:underline hover:text-black p-0'>
                <LogOutIcon size={20} className='mr-2 ml-0'/>
                <p>Logout</p>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar