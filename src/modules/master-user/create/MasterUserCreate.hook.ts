/* eslint-disable jsdoc/require-returns, jsdoc/require-param-type, jsdoc/require-param-description */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_USERS } from "@/fixture/master-user";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

/** Manage user create/edit form. */
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const existing = id ? (MOCK_USERS.find((user) => user.id === id) ?? null) : null;
  const [username, setUsername] = useState(existing?.username ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "User">(existing?.role ?? "User");
  /**
   *
   * @param event
   */
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => { setUsername(event.target.value); };
  /**
   *
   * @param event
   */
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => { setPassword(event.target.value); };
  /**
   *
   * @param event
   */
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => { setRole(event.target.value as "Admin" | "User"); };
  /**
   *
   * @param event
   */
  const handleSubmit = (event: React.SyntheticEvent): void => { event.preventDefault(); navigate("/master-user"); };
  /**
   *
   */
  const goBack = (): void => { navigate(-1); };

  return { username, password, role, isEdit: existing !== null, handleUsernameChange, handlePasswordChange, handleRoleChange, handleSubmit, goBack };
};
