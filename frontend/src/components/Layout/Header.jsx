import { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';

const Header = ({ toggleSidebar }) => {
  const currentDate = format(new Date(), 'EEEE, MMMM dd, yyyy');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

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
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            className="hidden md:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <FaDownload className="text-base" />
            <span>Install App</span>
          </button>
        )}

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FaBell className="text-gray-600 text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 border-l pl-4">
          <FaUserCircle className="text-3xl text-primary-600" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
