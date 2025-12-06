import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: `${getMonthName(item._id.month)} ${item._id.year}`,
    revenue: item.revenue,
    payments: item.count
  }));

  function getMonthName(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1];
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 5 }}
          activeDot={{ r: 7 }}
          name="Revenue (₹)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
