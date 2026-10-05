import * as React from "react";
import { useNavigate } from "react-router-dom";

import type { MasterMainCardProps } from "./MasterMain.type";
import { Icons } from "../../components/Icons";

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
      className="bg-brand-white/80 backdrop-blur-xl p-6 rounded-2xl border border-brand-gray-light shadow-xs hover:shadow-md hover:border-brand-blue/30 transition-all cursor-pointer flex flex-col items-start text-left gap-4 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-brand-blue transition-colors" />
      <div className="p-3.5 bg-brand-blue-light/60 rounded-xl text-brand-blue group-hover:bg-brand-blue group-hover:text-brand-white transition-colors">
        {props.icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-brand-text-dark mb-1 group-hover:text-brand-blue transition-colors">
          {props.title}
        </h3>
        <p className="text-xs leading-relaxed text-brand-text-medium">{props.description}</p>
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
      title: "Master Customer",
      description: "Manage customer profiles and contact info",
      icon: <Icons.Customers />,
      path: "/master-customer",
    },
    {
      title: "Master Item",
      description: "Manage items and inventory data",
      icon: <Icons.Database />,
      path: "/master-item",
    },
    {
      title: "Master User",
      description: "Manage system users and their roles",
      icon: <Icons.Customers />,
      path: "/master-user",
    },
    {
      title: "Master Role",
      description: "Manage user roles and access rights",
      icon: <Icons.Dashboard />,
      path: "/master-role",
    },
    {
      title: "Master Category",
      description: "Manage product and item categories",
      icon: <Icons.Dashboard />,
      path: "/master-category",
    },
    {
      title: "Master Voucher",
      description: "Manage discount codes and vouchers",
      icon: <Icons.Quotes />,
      path: "/master-voucher",
    },
    {
      title: "Master Project",
      description: "Manage project items and details",
      icon: <Icons.Database />,
      path: "/master-project",
    },
    {
      title: "Master Service Type",
      description: "Manage service types and pricing",
      icon: <Icons.Report />,
      path: "/master-service-type",
    },
    {
      title: "Master Payment Method",
      description: "Manage available payment methods",
      icon: <Icons.Report />,
      path: "/master-payment-method",
    },
    {
      title: "Master PIC",
      description: "Manage person in charge data",
      icon: <Icons.Customers />,
      path: "/master-pic",
    },
    {
      title: "Master Payment Type",
      description: "Manage payment types categorization",
      icon: <Icons.Report />,
      path: "/master-payment-type",
    },
  ];

  return (
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
  );
};

export default MasterMainComponent;
