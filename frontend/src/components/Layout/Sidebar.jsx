import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaClipboardCheck, 
  FaMoneyBillWave, 
  FaChartBar,
  FaUtensils
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/members', icon: FaUsers, label: 'Members' },
    { path: '/attendance', icon: FaClipboardCheck, label: 'Attendance' },
    { path: '/payments', icon: FaMoneyBillWave, label: 'Payments' },
    { path: '/reports', icon: FaChartBar, label: 'Reports' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 z-50 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-primary-600">
        <div className="flex items-center space-x-3">
          <FaUtensils className="text-3xl" />
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold">Manglam</h1>
              <p className="text-xs text-primary-200">Mass Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-6 py-4 transition-all duration-200 hover:bg-primary-600 ${
                isActive ? 'bg-primary-600 border-l-4 border-white' : ''
              }`
            }
          >
            <item.icon className="text-xl min-w-[24px]" />
            {isOpen && <span className="ml-4 font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary-600">
          <div className="text-xs text-primary-200 text-center">
            <p>© 2024 Manglam Mass</p>
            <p className="mt-1">All rights reserved</p>
          </div>
        </div>
      )}
    </aside>
    </>
  );
};

export default Sidebar;
