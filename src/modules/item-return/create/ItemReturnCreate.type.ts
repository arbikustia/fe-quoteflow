import type { SelectOption } from "@/components/Select";

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

export type ReturnCreateFormState = {
  orderOptions: SelectOption[];
  isOrdersLoading: boolean;
  isLoadingInitialData: boolean;
  isEditMode: boolean;
  selectedOrderId: string;
  orderItems: ReturnOrderItemRow[];
  filteredOrderItems: ReturnOrderItemRow[];
  returnItemIds: string[];
  uploadingItemId: string | null;
  photoPreview: { itemId: string; itemName: string; url: string } | null;
  stagedPhotoUrls: Map<string, string[]>;
  viewedPhoto: { itemName: string; url: string } | null;
  openPhoto: (itemId: string) => void;
  closeViewedPhoto: () => void;
  confirmPhoto: () => void;
  closePhotoPreview: () => void;
  returnDate: string;
  returnNotes: string;
  searchTerm: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleOrderChange: (value: string) => void;
  handleSearchChange: (term: string) => void;
  handleDateChange: (date: string) => void;
  handleNotesChange: (notes: string) => void;
  onCaptureItem: (id: string, files: File[]) => Promise<void>;
  onItemConditionChange: (id: string, condition: string) => void;
  onItemNotesChange: (id: string, notes: string) => void;
  handleSave: () => Promise<void>;
  goBack: () => void;
};
