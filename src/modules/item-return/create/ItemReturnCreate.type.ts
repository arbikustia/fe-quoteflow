import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import type { SelectOption } from "@/components/Select";

import type { ApiReturn, ApiReturnItem, StagedPhoto } from "../ItemReturn.type";

import type { ApiRentalOrder } from "@/modules/report/Report.type";
import type { useUploadImageMutation } from "@/services/master-item.service";

export type ReverseGeocodeResponse = {
  locality?: string;
  city?: string;
  principalSubdivision?: string;
  countryName?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type ReturnLocation = {
  coordinates: Coordinates;
  name: string;
};

export type ReturnOrderItemRow = {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  qty: number;
  unit: string;
  condition: string;
  notes: string;
  fileUrls: string[];
  fileNames: string[];
};

export type ReturnSourceItem = { item_id: string; item_name?: string; category_name?: string; qty: number };

export type ReturnPhotoPreview = { itemId: string; itemName: string; url: string };

export type ReturnViewedPhoto = { itemName: string; url: string };

export type ReturnPendingPhotos = { itemId: string; photos: StagedPhoto[] };

export type ReturnPhotoOverride = { fileUrls: string[]; fileNames: string[] };

export type ReturnItemOverride = { condition?: string; notes?: string };

export type ReturnItemOverrides = Record<string, ReturnItemOverride>;

export type ReturnPhotoOverrides = Map<string, ReturnPhotoOverride>;

export type ReturnSaveError = FetchBaseQueryError | SerializedError;

export type ReturnTextHandler = (value: string) => void;

export type ReturnRowHandler = (id: string) => void;

export type ReturnPhotoRemoveHandler = (id: string, photoIndex: number) => void;

export type ReturnNotesChangeHandler = (id: string, notes: string) => void;

export type ReturnCaptureHandler = (id: string, files: File[]) => Promise<void>;

export type ReturnUploadFn = ReturnType<typeof useUploadImageMutation>[0];

export type ReturnPayloadParams = {
  orderId: string;
  returnDate: string;
  returnNotes: string;
  status: number;
  rows: ReturnOrderItemRow[];
  returnItemIds: string[];
  isEditMode: boolean;
  existingItems?: ApiReturnItem[];
};

export type ReturnSaveValidationInput = {
  isEditMode: boolean;
  hasId: boolean;
  hasReturnData: boolean;
  hasSelectedOrder: boolean;
  isUploading: boolean;
  hasPreview: boolean;
  itemCount: number;
};

export type ReturnGuards = {
  upload: RefObject<boolean>;
  saving: RefObject<boolean>;
  orderId: RefObject<string>;
};

export type ReturnFieldsState = {
  selectedOrderId: string;
  setSelectedOrderId: Dispatch<SetStateAction<string>>;
  returnDate: string;
  setReturnDate: Dispatch<SetStateAction<string>>;
  returnNotes: string;
  setReturnNotes: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  uploadingItemId: string | null;
  setUploadingItemId: Dispatch<SetStateAction<string | null>>;
  itemOverrides: ReturnItemOverrides;
  setItemOverrides: Dispatch<SetStateAction<ReturnItemOverrides>>;
  photoOverrides: ReturnPhotoOverrides;
  setPhotoOverrides: Dispatch<SetStateAction<ReturnPhotoOverrides>>;
};

export type ReturnSourceState = {
  isEditMode: boolean;
  orderOptions: SelectOption[];
  isOrdersLoading: boolean;
  isLoadingInitialData: boolean;
  selectedOrder: ApiRentalOrder | undefined;
  returnData: ApiReturn | null;
  rawOrderItems: ReturnOrderItemRow[];
  returnItemIds: string[];
};

export type ReturnItemsState = {
  orderItems: ReturnOrderItemRow[];
  filteredOrderItems: ReturnOrderItemRow[];
  onItemConditionChange: (id: string, condition: string) => void;
  onItemNotesChange: (id: string, notes: string) => void;
};

export type ReturnViewerState = {
  viewedPhoto: ReturnViewedPhoto | null;
  viewedRef: RefObject<ReturnViewedPhoto | null>;
  showPhoto: (photo: ReturnViewedPhoto | null) => void;
  closeViewedPhoto: () => void;
};

export type ReturnPreviewState = {
  photoPreview: ReturnPhotoPreview | null;
  closePhotoPreview: () => void;
  showPreview: (preview: ReturnPhotoPreview, photos: StagedPhoto[]) => void;
  takePending: () => ReturnPendingPhotos | null;
};

export type ReturnStagedState = {
  stagedPhotoUrls: Map<string, string[]>;
  stagedRef: RefObject<Map<string, StagedPhoto[]>>;
  uploadedRef: RefObject<ReturnPhotoOverrides>;
  syncStaged: () => void;
  getStagedUrl: (itemId: string) => string | undefined;
  addStaged: (itemId: string, photos: StagedPhoto[]) => void;
  removeStaged: (itemId: string, photoIndex: number) => boolean;
  clearStaged: () => void;
};

export type ReturnUploadStaged = (rows: ReturnOrderItemRow[]) => Promise<ReturnOrderItemRow[]>;

export type ReturnCaptureInput = {
  guards: ReturnGuards;
  preview: ReturnPreviewState;
  staged: ReturnStagedState;
  fields: ReturnFieldsState;
  orderItems: ReturnOrderItemRow[];
};

export type ReturnCaptureState = {
  onCaptureItem: ReturnCaptureHandler;
  confirmPhoto: () => void;
};

export type ReturnPhotoActionsInput = {
  viewer: ReturnViewerState;
  staged: ReturnStagedState;
  fields: ReturnFieldsState;
  orderItems: ReturnOrderItemRow[];
};

export type ReturnPhotoActionsState = {
  openPhoto: (itemId: string) => void;
  onRemovePhoto: (itemId: string, photoIndex: number) => void;
};

export type ReturnPhotosView = {
  photoPreview: ReturnPhotoPreview | null;
  closePhotoPreview: () => void;
  stagedPhotoUrls: Map<string, string[]>;
  viewedPhoto: ReturnViewedPhoto | null;
  closeViewedPhoto: () => void;
  openPhoto: (itemId: string) => void;
  onRemovePhoto: (itemId: string, photoIndex: number) => void;
  onCaptureItem: ReturnCaptureHandler;
  confirmPhoto: () => void;
};

export type ReturnPhotosState = {
  view: ReturnPhotosView;
  guards: ReturnGuards;
  setOrderGuard: (orderId: string) => void;
  resetPhotos: () => void;
  uploadStaged: ReturnUploadStaged;
};

export type ReturnSubmitState = {
  isSubmitting: boolean;
  submit: (input: ReturnSaveInput) => Promise<string | null>;
  recordActivity: (input: ReturnSaveInput) => Promise<void>;
};

export type ReturnSaveInput = {
  id: string | undefined;
  source: ReturnSourceState;
  fields: ReturnFieldsState;
  orderItems: ReturnOrderItemRow[];
  photos: ReturnPhotosState;
  submitState: ReturnSubmitState;
  navigate: (path: string) => void;
};

export type ReturnUploadInput = {
  upload: ReturnUploadFn;
  staged: ReturnStagedState;
  viewer: ReturnViewerState;
  fields: ReturnFieldsState;
};

export type ReturnHandlersState = {
  handleOrderChange: (value: string) => void;
  handleSearchChange: (term: string) => void;
  handleDateChange: (date: string) => void;
  handleNotesChange: (notes: string) => void;
  goBack: () => void;
};

export type ReturnCreateFormState = ReturnPhotosView & ReturnItemsState & ReturnHandlersState & {
  orderOptions: SelectOption[];
  isOrdersLoading: boolean;
  isLoadingInitialData: boolean;
  isEditMode: boolean;
  selectedOrderId: string;
  returnItemIds: string[];
  uploadingItemId: string | null;
  returnDate: string;
  returnNotes: string;
  searchTerm: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleSave: () => Promise<void>;
};

export type ReturnPhotoRowProps = {
  row: ReturnOrderItemRow;
  form: ReturnCreateFormState;
};
