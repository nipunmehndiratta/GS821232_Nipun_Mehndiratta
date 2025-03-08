import logo from '../assets/gsynergy_logo_v2_long_description.svg';
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";


const NavBar = () => (
  <nav className="p-4 flex justify-between items-center top-0">
    <img src={logo} alt="GSynergy Logo" className='h-15'/>
    <h1 className='text-5xl font-thick'>Data Viewer App</h1>
    <div className='flex text-3xl'>
        <FaRegCircleUser/>
        <IoMdArrowDropdown/>
    </div>
  </nav>
);

export default NavBar;