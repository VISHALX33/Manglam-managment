import { format } from 'date-fns';
import { FaUser, FaPhone, FaUtensils } from 'react-icons/fa';

const RecentMembers = ({ members }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Members</h3>
      
      {members && members.length > 0 ? (
        <div className="space-y-3">
          {members.map((member) => (
            <div 
              key={member._id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaPhone className="text-xs" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className="badge badge-success">
                  {member.foodTime}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">No recent members</p>
      )}
    </div>
  );
};

export default RecentMembers;
