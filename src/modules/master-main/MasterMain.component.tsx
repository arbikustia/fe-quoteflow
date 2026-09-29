import { useNavigate } from "react-router-dom";

import Layout from "../../app/layout";
import { Icons } from "../../components/Icons";

const MasterMainComponent = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Master User",
      description: "Manage system users and their roles",
      icon: <Icons.Customers />,
      path: "/master-data/users",
    },
    {
      title: "Master Category",
      description: "Manage product and item categories",
      icon: <Icons.Dashboard />,
      path: "/master-data/categories",
    },
    {
      title: "Master Item",
      description: "Manage items and inventory data",
      icon: <Icons.Database />,
      path: "/master-data/items",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">Master Data</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="bg-brand-white p-6 rounded-xl border border-brand-gray-light shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-4 group"
            >
              <div className="p-4 bg-brand-gray-light rounded-full text-brand-blue group-hover:bg-brand-blue group-hover:text-brand-white transition-colors">
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-text-dark mb-2">{card.title}</h3>
                <p className="text-sm text-brand-text-medium">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MasterMainComponent;
