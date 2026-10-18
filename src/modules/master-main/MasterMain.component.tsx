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
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-36 w-full items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-action-primary-subtle text-action-primary transition-colors group-hover:bg-action-primary group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-semibold text-text-primary">{title}</span>
        <span className="mt-2 block text-sm leading-5 text-text-secondary">{description}</span>
      </span>
      <span aria-hidden="true" className="shrink-0 text-xl text-text-tertiary transition-transform group-hover:translate-x-1">→</span>
    </button>
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
    <div className="flex flex-col gap-6 px-6 pb-20 lg:px-0">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Master Data</h1>
        <p className="mt-2 text-sm text-text-secondary">Manage core data used across QuoteFlow.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
