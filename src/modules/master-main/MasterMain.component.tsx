import * as React from "react";

import type { MasterMainCardProps } from "./MasterMain.type";

/**
 * Render Master Main Card
 * @param {MasterMainCardProps} props - card props
 * @returns {React.ReactElement} - card
 */
export const MasterMainCard = (props: MasterMainCardProps): React.ReactElement => {
  const { title, description, icon, onClick } = props;

  return (
    <div
      onClick={onClick}
      className="bg-brand-white/80 backdrop-blur-xl p-6 rounded-2xl border border-brand-gray-light shadow-lg hover:shadow-md hover:border-brand-blue/35 transition-all cursor-pointer flex flex-row items-start text-left gap-4 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-brand-blue transition-colors" />
      <div className="p-16 bg-brand-blue-light/60 rounded-xl text-brand-blue group-hover:bg-brand-blue group-hover:text-brand-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-brand-text-dark mb-1 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-brand-text-medium">{description}</p>
      </div>
    </div>
  );
};

/**
 * Master Main Component
 * @param {object} props - component props
 * @param {readonly MasterMainCardProps[]} props.cards - master cards list
 * @param {(path: string) => void} props.onCardClick - card click handler
 * @returns {React.ReactElement} - component
 */
export const MasterMainComponent = (props: {
  readonly cards: readonly MasterMainCardProps[];
  readonly onCardClick: (path: string) => void;
}): React.ReactElement => {
  const { cards, onCardClick } = props;

  return (
    <div className="flex flex-col h-fit p-5 mb-20">
      <div className="mb-6">
        <span className="text-3xl font-bold text-brand-text-dark">Master Data</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <MasterMainCard
            key={card.path}
            title={card.title}
            description={card.description}
            icon={card.icon}
            path={card.path}
            onClick={() => onCardClick(card.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterMainComponent;
