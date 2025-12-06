import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PaymentPlanChart = ({ data }) => {
  const planNames = {
    monthly: 'Monthly (₹3300)',
    '15days': '15 Days (₹1650)',
    nasta: 'Nasta Only (₹500)',
    custom: 'Custom'
  };

  const chartData = data.map(item => ({
    name: planNames[item._id] || item._id,
    members: item.count,
    revenue: item.totalAmount
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
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
        <Bar dataKey="members" fill="#10b981" name="Members" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PaymentPlanChart;
