import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "@/services/master-user.service";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

/** Manage user create/edit form. */
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeUser = location.state?.user;
  const { data: detailData } = useGetUserByIdQuery(id ?? "", { skip: !id || Boolean(routeUser) });
  const detailUser = detailData?.data && !Array.isArray(detailData.data) ? detailData.data : null;
  const existingName = routeUser?.username ?? detailUser?.username ?? "";
  const existingEmail = routeUser?.email ?? detailUser?.email ?? "";
  const existingRole = routeUser?.role ?? detailUser?.role?.[0] ?? "User";

  const [username, setUsername] = useState(existingName);
  const [email, setEmail] = useState(existingEmail);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setRole] = useState(existingRole);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => { setUsername(event.target.value); };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => { setEmail(event.target.value); };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => { setPassword(event.target.value); };
  const handleTogglePasswordVisibility = (): void => { setIsPasswordVisible((previous) => !previous); };
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => { setRole(event.target.value); };
  const handleStatusChange = (): void => { setIsActive((previous) => !previous); };

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = isEditMode && id
        ? await updateUser({ id, username, email, password, role: [role], status: isActive ? 1 : 0 }).unwrap()
        : await createUser({ username, email, password, role: [role], status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage("User request failed.");
        return;
      }

      navigate("/master-user");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update user. Please try again." : "Unable to create user. Please try again.");
    }
  };

  const goBack = (): void => { navigate(-1); };

  return {
    username,
    email,
    password,
    isPasswordVisible,
    role,
    isActive,
    isEditMode,
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleRoleChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
