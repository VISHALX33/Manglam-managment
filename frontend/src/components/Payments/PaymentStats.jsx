import { FaMoneyBillWave, FaChartLine, FaReceipt, FaCreditCard } from 'react-icons/fa';

const PaymentStats = ({ stats }) => {
  const { currentPeriod, paymentMethodStats } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Revenue</p>
            <h3 className="text-3xl font-bold mt-2">
              ₹{currentPeriod?.totalRevenue?.toLocaleString() || 0}
            </h3>
            <p className="text-green-100 text-sm mt-2">
              This period
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <FaMoneyBillWave className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Total Payments */}
      <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Payments</p>
            <h3 className="text-3xl font-bold mt-2">
              {currentPeriod?.totalPayments || 0}
            </h3>
            <p className="text-blue-100 text-sm mt-2">
              Transactions
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <FaReceipt className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Average Payment */}
      <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Average Payment</p>
            <h3 className="text-3xl font-bold mt-2">
              ₹{currentPeriod?.averagePayment?.toLocaleString() || 0}
            </h3>
            <p className="text-purple-100 text-sm mt-2">
              Per transaction
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <FaChartLine className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-3">
          <FaCreditCard className="text-gray-600" />
          <p className="text-sm text-gray-600 font-medium">Payment Methods</p>
        </div>
        <div className="space-y-2">
          {paymentMethodStats && paymentMethodStats.length > 0 ? (
            paymentMethodStats.map((method) => (
              <div key={method._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 capitalize">
                  {method._id.replace('_', ' ')}
                </span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{method.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({method.count})
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;
