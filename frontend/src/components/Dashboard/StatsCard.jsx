import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const StatsCard = ({ title, value, icon: Icon, iconColor, subtitle, trend }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <FaArrowUp className="text-green-500" />;
    if (trend === 'down') return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
          <div className="flex items-center mt-2 space-x-2">
            {getTrendIcon()}
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className={`${iconColor} p-3 rounded-lg`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
