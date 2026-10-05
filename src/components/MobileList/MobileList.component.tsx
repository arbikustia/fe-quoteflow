import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

export type MobileListItemProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly meta?: string;
  readonly imageUrl?: string;
  readonly fallbackInitial?: string;
  readonly hideImage?: boolean;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly onClick?: () => void;
};

/**
 * Single row card for mobile list.
 * @param {MobileListItemProps} props - card props
 * @returns {React.ReactElement}
 */
export const MobileListCard = (props: MobileListItemProps): React.ReactElement => {
  const { title, subtitle, meta, imageUrl, fallbackInitial, hideImage, onEdit, onClick } = props;
  const showImage = !hideImage;
  const initial = fallbackInitial ?? title.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-0 py-4 bg-transparent border-b border-brand-gray-light last:border-b-0 active:bg-brand-gray-light/20 transition-colors cursor-pointer"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Thumbnail / Avatar (if provided and not hidden) */}
      {showImage && (
        imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-brand-gray-light border border-brand-gray-light"
            loading="lazy"
            onError={(e): void => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center shrink-0 text-base">
            {initial}
          </div>
        )
      )}

      {/* Text Info Stack */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-base font-normal text-brand-text-dark leading-snug truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm font-normal text-brand-text-medium/80 truncate">
            {subtitle}
          </p>
        )}
        {meta && (
          <p className="text-xs font-normal text-brand-text-medium/80 truncate">
            {meta}
          </p>
        )}
      </div>

      {/* Edit Action Button */}
      {onEdit && (
        <button
          onClick={(e): void => {
            e.stopPropagation();
            onEdit();
          }}
          className="shrink-0 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors cursor-pointer"
          aria-label="Edit"
          title="Edit"
        >
          <FiEdit2 className="w-5 h-5" />
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
 * Mobile list container for card items.
 * @param {MobileListProps} props
 * @returns {React.ReactElement}
 */
export const MobileList = ({
  data,
  emptyText = "No data available",
}: MobileListProps): React.ReactElement => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-base text-brand-text-medium font-medium">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="bg-transparent overflow-hidden divide-y divide-brand-gray-light">
      {data.map((item, i) => (
        <MobileListCard key={`${item.title}-${i}`} {...item} />
      ))}
    </div>
  );
};

export default MobileList;