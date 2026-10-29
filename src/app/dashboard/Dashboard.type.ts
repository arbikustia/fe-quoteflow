export type DashboardRoute = "/order" | "/return" | "/document" | "/master-main" | "/report";

export type DashboardMenuItem = {
  route?: DashboardRoute;
  label: string;
  icon: string;
  backgroundClassName: string;
};
