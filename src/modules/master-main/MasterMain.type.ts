import type React from "react";

/**
 * Master main card properties.
 */
export type MasterMainCardProps = {
  title: string;
  description: string;
  icon: React.ReactElement;
  image?: string;
  path: string;
  onClick?: () => void;
};

export type MasterMainProps = {
  cards: MasterMainCardProps[];
  onCardClick: (path: string) => void;
};
