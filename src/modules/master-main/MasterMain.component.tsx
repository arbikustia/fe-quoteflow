import * as React from "react";

import type { MasterMainCardProps, MasterMainProps } from "./MasterMain.type";
import { PageLayout } from "../../app/shared/PageLayout";

/**
 * Render Master Main Card Skeleton
 * @param {number} key - skeleton key
 * @returns {React.ReactElement} - skeleton card
 */
export const MasterMainCardSkeleton = (key: number): React.ReactElement => (
  <div
    key={key}
    className="flex min-h-36 animate-pulse items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5"
    role="status"
    aria-label="Loading master data"
  >
    <div data-testid="master-card-skeleton-image" className="h-28 w-44 shrink-0 rounded-xl bg-background-subtle" />
    <div className="min-w-0 flex-1 pt-1">
      <div className="h-6 w-2/3 rounded-md bg-background-subtle" />
      <div className="mt-3 h-4 w-full rounded-md bg-background-subtle" />
      <div className="mt-2 h-4 w-4/5 rounded-md bg-background-subtle" />
    </div>
  </div>
);

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
 * @param {() => void} props.onBack - back button handler
 * @param {boolean} [props.isLoaded] - illustration load state
 * @returns {React.ReactElement} - component
 */
export const MasterMainComponent = (props: MasterMainProps): React.ReactElement => {
  const { cards, onCardClick, onBack, isLoaded = true } = props;
  const skeletonKeys = cards.map((_card, index) => index);

  return (
    <PageLayout
      title="Master Data"
      subtitle="Manage core data used across QuoteFlow."
      breadcrumbs={["Master Data"]}
      mobileHeaderClassName="px-0"
      mobileTitleClassName="text-4xl"
      onBack={onBack}
    >
      <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
        <div className="flex flex-col gap-6 pb-20 pt-2 lg:pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {isLoaded
              ? cards.map((card) => (
                  <MasterMainCard
                    key={card.path}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    image={card.image}
                    path={card.path}
                    onClick={() => onCardClick(card.path)}
                  />
                ))
              : skeletonKeys.map(MasterMainCardSkeleton)}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MasterMainComponent;
