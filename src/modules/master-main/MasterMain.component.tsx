import * as React from "react";

import type { MasterMainCardProps, MasterMainProps } from "./MasterMain.type";

/**
 * Render Master Main Card
 * @param {MasterMainCardProps} props - card props
 * @returns {React.ReactElement} - card
 */
export const MasterMainCard = (props: MasterMainCardProps): React.ReactElement => {
  const { title, description, icon, image, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-36 w-full items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
    >
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-28 w-44 shrink-0 rounded-xl object-contain"
        />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-action-primary-subtle text-action-primary transition-colors group-hover:bg-action-primary group-hover:text-white">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-2xl font-semibold text-text-primary lg:text-lg">{title}</span>
        <span className="mt-2 block text-lg leading-7 text-text-secondary lg:text-sm lg:leading-5">{description}</span>
      </span>
    </button>
  );
};

/**
 * Master Main Component
 * @param {object} props - component props
 * @param {MasterMainCardProps[]} props.cards - master cards list
 * @param {(path: string) => void} props.onCardClick - card click handler
 * @returns {React.ReactElement} - component
 */
export const MasterMainComponent = (props: MasterMainProps): React.ReactElement => {
  const { cards, onCardClick, onBack } = props;

  return (
    <div className="flex flex-col gap-6 px-6 pt-4 pb-20 lg:px-0 lg:pt-0">
      <div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-4xl font-bold text-text-primary lg:text-3xl">Master Data</h1>
        </div>
        <p className="mt-2 text-sm text-text-secondary">Manage core data used across QuoteFlow.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <MasterMainCard
            key={card.path}
            title={card.title}
            description={card.description}
            icon={card.icon}
            image={card.image}
            path={card.path}
            onClick={() => onCardClick(card.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterMainComponent;
