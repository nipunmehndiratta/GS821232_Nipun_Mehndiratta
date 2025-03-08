import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineStore } from "react-icons/md";
import { LuShapes } from "react-icons/lu";
import { IoBarChartSharp } from "react-icons/io5";
import { MdOutlineInsertChart } from "react-icons/md";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Store', icon: MdOutlineStore, path: '/store' },
    { text: 'SKU', icon: LuShapes, path: '/sku' },
    { text: 'Planning', icon: IoBarChartSharp, path: '/planning' },
    { text: 'Charts', icon: MdOutlineInsertChart, path: '/chart' },
  ];

  const selectedPage =
    menuItems.find((item) => item.path === location.pathname)?.text || 'Store';

  const handleSelection = (item: { text: string; path: string }) => {
    navigate(item.path);
  };

  return (
    <div className="w-46 h-screen">
      <ul className="pt-4 text-2xl">
        {menuItems.map((item) => (
          <li key={item.text} className="mb-2">
            <button
              className={`flex items-center w-full hover:bg-neutral-200 p-3 rounded cursor-pointer ${
                selectedPage === item.text ? 'bg-neutral-200' : ''
              }`}
              onClick={() => handleSelection(item)}
            >
              <item.icon className="mr-4 text-4xl" />
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
