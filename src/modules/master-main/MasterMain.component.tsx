import * as React from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../app/layout";
import { Icons } from "../../components/Icons";

/**
 * Master Main Card Props
 */
type MasterMainCardProps = {
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactElement;
  readonly path: string;
};

/**
 * Render Master Main Card
 * @param {MasterMainCardProps} props - card props
 * @returns {React.ReactElement} - card
 */
const MasterMainCard = (props: MasterMainCardProps): React.ReactElement => {
  const navigate = useNavigate();

  /**
   * Handle card click
   * @returns {void} - void
   */
  const handleClick = (): void => {
    navigate(props.path);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-brand-white p-6 rounded-xl border border-brand-gray-light shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-4 group"
    >
      <div className="p-4 bg-brand-gray-light rounded-full text-brand-blue group-hover:bg-brand-blue group-hover:text-brand-white transition-colors">
        {props.icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-brand-text-dark mb-2">{props.title}</h3>
        <p className="text-sm text-brand-text-medium">{props.description}</p>
      </div>
    </div>
  );
};

/**
 * Master Main Component
 * @returns {React.ReactElement} - component
 */
const MasterMainComponent = (): React.ReactElement => {
  const cards: MasterMainCardProps[] = [
    {
      title: "Master User",
      description: "Manage system users and their roles",
      icon: <Icons.Customers />,
      path: "/master-user",
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
            <MasterMainCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              path={card.path}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MasterMainComponent;
