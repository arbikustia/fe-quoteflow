import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { MobileListItemProps, MobileListProps } from "./MobileList.type";

export type { MobileListItemProps, MobileListProps } from "./MobileList.type";

/**
 * Render optional mobile list image or initial.
 * @param {MobileListItemProps} props - Card props
 * @returns {React.ReactElement | null} Image or initial
 */
const _renderImage = (props: MobileListItemProps): React.ReactElement | null => {
  const { fallbackInitial, hideImage, imageUrl, title } = props;

  if (hideImage) {
    return null;
  }

  if (imageUrl) {
    return <img src={imageUrl} alt={title} className="h-12 w-12 shrink-0 rounded-xl border border-border-default object-cover" loading="lazy" />;
  }

  return <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-action-primary-subtle text-base font-bold text-action-primary">{fallbackInitial ?? title.charAt(0).toUpperCase()}</div>;
};

/**
 * Render mobile list text content.
 * @param {MobileListItemProps} props - Card props
 * @returns {React.ReactElement} Text content
 */
const _renderText = (props: MobileListItemProps): React.ReactElement => {
  const { meta, metaClassName, subtitle, subtitleClassName, title, titleClassName } = props;

  return (
    <div className="min-w-0 flex-1 space-y-1">
      <p className={titleClassName ?? "truncate text-base font-normal leading-snug text-text-primary"}>{title}</p>
      {subtitle && <p className={subtitleClassName ?? "truncate text-sm font-normal text-text-secondary"}>{subtitle}</p>}
      {meta && <p className={metaClassName ?? "truncate text-xs font-normal text-text-secondary"}>{meta}</p>}
    </div>
  );
};

/**
 * Render optional mobile list action.
 * @param {MobileListItemProps} props - Card props
 * @returns {React.ReactElement | null} Action element
 */
const _renderAction = (props: MobileListItemProps): React.ReactElement | null => {
  const { badge, hideEdit, onEdit } = props;

  if (badge) {
    return <div className="shrink-0">{badge}</div>;
  }

  if (!onEdit || hideEdit) {
    return null;
  }

  /**
   * Stop card click and edit item.
   * @param {React.MouseEvent<HTMLButtonElement>} event - Edit button click event
   * @returns {void} No return value
   */
  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit();
  };

  return (
    <button type="button" onClick={handleEdit} className="shrink-0 rounded-lg p-2 text-action-primary transition-colors hover:bg-action-primary-subtle" aria-label="Edit" title="Edit">
      <FiEdit2 className="h-5 w-5" />
    </button>
  );
};

/**
 * Render one mobile list card.
 * @param {MobileListItemProps} props - Card props
 * @returns {React.ReactElement} Mobile list card
 */
export const MobileListCard = (props: MobileListItemProps): React.ReactElement => {
  const { onClick } = props;

  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-4 border-b border-border-default bg-transparent px-0 py-4 transition-colors last:border-b-0 active:bg-background-subtle" role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
      {_renderImage(props)}
      {_renderText(props)}
      {_renderAction(props)}
    </div>
  );
};

/**
 * Render mobile list or empty state.
 * @param {MobileListProps} props - List props
 * @returns {React.ReactElement} Mobile list
 */
export const MobileList = (props: MobileListProps): React.ReactElement => {
  const { data, emptyText = "No data available" } = props;

  if (data.length === 0) {
    return <div className="py-12 text-center text-base font-medium text-text-secondary">{emptyText}</div>;
  }

  return <div className="divide-y divide-border-default overflow-hidden bg-transparent">{data.map((item, index) => <MobileListCard key={`${item.title}-${index}`} {...item} />)}</div>;
};

export default MobileList;
