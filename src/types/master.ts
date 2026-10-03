/**
 * Master Data Shared Types
 */

export type MasterStatus = "active" | "inactive";

/**
 * Base properties for all Master Data
 */
export type MasterBase = {
  id: string;
  status: MasterStatus;
  createAt: string;
  createBy: string;
};

/**
 * Generic Select Option Type
 */
export type SelectOption = {
  label: string;
  value: string;
};
