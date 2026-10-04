import * as React from "react";

export type MobileListItemProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly meta?: string;
  readonly imageUrl?: string;
  readonly fallbackInitial?: string;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly onClick?: () => void;
};

/**
 * Single row card — matches Pinterest ref: thumbnail | title+subtitle+meta | Edit link.
 * @param {MobileListItemProps} props - props
 * @returns {React.ReactElement} card
 */
export const MobileListCard = (props: MobileListItemProps): React.ReactElement => {
  const { title, subtitle, meta, imageUrl, fallbackInitial, onEdit, onClick } = props;
  const initial = fallbackInitial ?? title.charAt(0).toUpperCase();
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-brand-white border-b border-brand-gray-light last:border-b-0 active:bg-brand-gray-light/50"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-11 h-11 rounded-lg object-cover shrink-0 bg-brand-gray-light" loading="lazy" />
      ) : (
        <div className="w-11 h-11 rounded-lg bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center shrink-0 text-sm">{initial}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-brand-text-dark truncate leading-tight">{title}</p>
        {subtitle && <p className="text-xs font-semibold text-brand-text-dark truncate">{subtitle}</p>}
        {meta && <p className="text-xs text-brand-text-medium truncate">{meta}</p>}
      </div>
      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="shrink-0 text-sm font-bold text-brand-blue px-2 py-1"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export type MobileListProps = {
  readonly data: MobileListItemProps[];
  readonly emptyText?: string;
};

/**
 * Vertical list for mobile (< md). Wraps cards in rounded container.
 * @param {MobileListProps} props - props
 * @returns {React.ReactElement} list
 */
export const MobileList = ({ data, emptyText = "No data available" }: MobileListProps): React.ReactElement => {
  if (data.length === 0) return <div className="py-10 text-center text-sm text-brand-text-medium">{emptyText}</div>;
  return <div className="bg-brand-white rounded-xl border border-brand-gray-light overflow-hidden divide-y divide-brand-gray-light">{data.map((item, i) => <MobileListCard key={`${item.title}-${i}`} {...item} />)}</div>;
};

export default MobileList;
