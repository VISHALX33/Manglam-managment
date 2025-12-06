import { format } from 'date-fns';
import { FaCircle } from 'react-icons/fa';

const ActivityLog = ({ activities }) => {
  const getActivityColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-500';
      case 'UPDATE':
        return 'text-blue-500';
      case 'DELETE':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      
      {activities && activities.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div 
              key={activity._id} 
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <FaCircle className={`text-xs mt-1 ${getActivityColor(activity.action)}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">No recent activity</p>
      )}
    </div>
  );
};

export default ActivityLog;
