/* eslint-disable jsdoc/require-returns */
import type { ReactElement } from "react";

import { MasterItemCreateForm } from "./MasterItemCreate.component";
import { useMasterItemCreateForm } from "./MasterItemCreate.hook";

import Layout from "@/app/layout";

/** Render item create container. @returns {ReactElement} Create page */
const MasterItemCreateContainer = (): ReactElement => {
  const formState = useMasterItemCreateForm();

  return <Layout><MasterItemCreateForm {...formState} /></Layout>;
};

export default MasterItemCreateContainer;
