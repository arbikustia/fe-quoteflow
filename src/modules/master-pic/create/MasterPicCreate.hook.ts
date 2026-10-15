/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PICS } from "@/fixture/master-pic";

import type { MasterPicCreateState } from "./MasterPicCreate.type";

/**
 * Manage PIC create state.
 * @returns {MasterPicCreateState} Form state
 */
export const useMasterPicCreate = (): MasterPicCreateState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const existing = id ? MOCK_PICS.find((item) => item.id === id) : null;
  const [name, setName] = useState(existing?.name ?? "");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };
  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    navigate("/master-pic");
  };
  const goBack = (): void => {
    navigate(-1);
  };

  return { name, isEdit: Boolean(existing), handleNameChange, handleSubmit, goBack };
};
