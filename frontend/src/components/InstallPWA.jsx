import { useState, useEffect } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-green-500 p-4 max-w-sm">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <FaTimes className="text-lg" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaDownload className="text-2xl text-green-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Install Manglam Mass
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Install our app for quick access and offline support!
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
              >
                Install
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
