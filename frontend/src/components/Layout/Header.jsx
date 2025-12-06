import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const Header = ({ toggleSidebar }) => {
  const currentDate = format(new Date(), 'EEEE, MMMM dd, yyyy');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaBars className="text-gray-600 text-xl" />
        </button>
        
        <div>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FaBell className="text-gray-600 text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 border-l pl-4">
          <FaUserCircle className="text-3xl text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
