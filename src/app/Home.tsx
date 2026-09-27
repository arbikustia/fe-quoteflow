import Layout from "./layout";
import { Link } from "react-router-dom";

// Dummy icons for stats
const StatIcons = {
  Revenue: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Quotes: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export default function Home() {
  return (
    <Layout pageTitle="Dashboard Overview">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(93,124,240,0.1)] transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-brand-text-medium mb-1">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-extrabold text-brand-text-dark">
                  Rp 150.000.000
                </h3>
                <p className="text-xs font-medium text-brand-blue-light0 mt-2 flex items-center gap-1">
                  <span className="bg-brand-blue-light text-brand-blue-dark px-1.5 py-0.5 rounded-md">
                    +12.5%
                  </span>{" "}
                  from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <StatIcons.Revenue />
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(240,165,93,0.1)] transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-brand-text-medium mb-1">
                  Active Quotes
                </p>
                <h3 className="text-3xl font-extrabold text-brand-text-dark">
                  12
                </h3>
                <p className="text-xs font-medium text-brand-orange mt-2 flex items-center gap-1">
                  <span className="bg-brand-orange-light text-brand-orange-dark px-1.5 py-0.5 rounded-md">
                    +5.2%
                  </span>{" "}
                  from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                <StatIcons.Quotes />
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-brand-text-medium mb-1">
                  New Customers
                </p>
                <h3 className="text-3xl font-extrabold text-brand-text-dark">
                  4
                </h3>
                <p className="text-xs font-medium text-brand-text-medium mt-2 flex items-center gap-1">
                  <span className="bg-brand-gray-light text-brand-text-medium px-1.5 py-0.5 rounded-md">
                    Stable
                  </span>{" "}
                  from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-gray-light text-brand-text-medium flex items-center justify-center group-hover:scale-110 transition-transform">
                <StatIcons.Users />
              </div>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-brand-white/90 backdrop-blur-xl border border-brand-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-brand-gray-light flex justify-between items-center">
              <h2 className="text-lg font-bold text-brand-text-dark">
                Recent Quotes
              </h2>
              <button className="text-sm font-bold text-brand-blue hover:text-brand-blue-dark transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-gray-light/50">
                    <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-light">
                  {[
                    {
                      client: "YOUTHCAMP GPdI",
                      amount: "Rp 42.500.000",
                      status: "Pending",
                      date: "Today, 10:24 AM",
                      color: "text-brand-orange-dark",
                      bg: "bg-brand-orange-light",
                    },
                    {
                      client: "Gereja Bethany",
                      amount: "Rp 15.000.000",
                      status: "Approved",
                      date: "Yesterday, 3:15 PM",
                      color: "text-brand-blue",
                      bg: "bg-brand-blue-light",
                    },
                    {
                      client: "Wedding Party",
                      amount: "Rp 20.000.000",
                      status: "On Rental",
                      date: "Sep 24, 2026",
                      color: "text-brand-blue",
                      bg: "bg-brand-blue-light",
                    },
                    {
                      client: "Konser Musik",
                      amount: "Rp 75.000.000",
                      status: "Completed",
                      date: "Sep 22, 2026",
                      color: "text-brand-text-medium",
                      bg: "bg-brand-gray-light",
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-brand-gray-light/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-brand-text-dark">
                          {row.client}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-brand-text-dark">
                        {row.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${row.bg} ${row.color}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-text-medium">
                        {row.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Widget */}
          <div className="bg-brand-white/90 backdrop-blur-xl border border-brand-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-brand-text-dark mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/quotes/create" className="w-full flex items-center justify-between p-4 rounded-xl border border-brand-gray-light hover:border-brand-blue/30 hover:bg-brand-blue/5 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                      <StatIcons.Quotes />
                    </div>
                    <span className="font-bold text-brand-text-dark group-hover:text-brand-blue transition-colors">
                      New Order
                    </span>
                  </div>
                  <span className="text-brand-text-medium">→</span>
                </Link>
                <Link to="/return" className="w-full flex items-center justify-between p-4 rounded-xl border border-brand-gray-light hover:border-brand-orange/30 hover:bg-brand-orange/5 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center">
                      <StatIcons.Users />
                    </div>
                    <span className="font-bold text-brand-text-dark group-hover:text-brand-orange transition-colors">
                      Return
                    </span>
                  </div>
                  <span className="text-brand-text-medium">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
