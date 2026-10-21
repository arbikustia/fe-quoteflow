import * as React from "react";

import type { MasterMainCardProps } from "./MasterMain.type";
import categoryIllustration from "../../assets/category-illustration.png";
import customerIllustration from "../../assets/customer-illustration.png";
import itemIllustration from "../../assets/item-illustration.png";
import paymentMethodIllustration from "../../assets/payment-method-illustration.png";
import paymentTypeIllustration from "../../assets/payment-type-illustration.png";
import picIllustration from "../../assets/pic-illustration.png";
import projectIllustration from "../../assets/project-illustration.png";
import roleIllustration from "../../assets/role-illustration.png";
import userIllustration from "../../assets/user-illustration.png";
import voucherIllustration from "../../assets/voucher-illustration.png";
import { MASTER_DATA_ITEMS } from "../../components/Sidebar/Sidebar.config";

const MASTER_MAIN_IMAGES = new Map<string, string>([
  ["/master-customer", customerIllustration],
  ["/master-category", categoryIllustration],
  ["/master-item", itemIllustration],
  ["/master-project", projectIllustration],
  ["/master-payment-method", paymentMethodIllustration],
  ["/master-payment-type", paymentTypeIllustration],
  ["/master-voucher", voucherIllustration],
  ["/master-role", roleIllustration],
  ["/master-user", userIllustration],
  ["/master-pic", picIllustration],
]);

export const MASTER_MAIN_CONFIG: readonly MasterMainCardProps[] =
  MASTER_DATA_ITEMS.map((item) => ({
    title: `Master ${item.name}`,
    description: item.description,
    icon: React.createElement(item.icon),
    image: MASTER_MAIN_IMAGES.get(item.path),
    path: item.path,
  }));
