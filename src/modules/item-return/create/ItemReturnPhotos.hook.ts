import { useEffect, useRef, useState } from "react";

import type { StagedPhoto } from "../ItemReturn.type";

import type {
  ReturnCaptureInput,
  ReturnCaptureState,
  ReturnFieldsState,
  ReturnGuards,
  ReturnOrderItemRow,
  ReturnPendingPhotos,
  ReturnPhotoActionsInput,
  ReturnPhotoActionsState,
  ReturnPhotoOverrides,
  ReturnPhotoPreview,
  ReturnPhotosState,
  ReturnPreviewState,
  ReturnStagedState,
  ReturnUploadInput,
  ReturnUploadStaged,
  ReturnViewedPhoto,
  ReturnViewerState,
} from "./ItemReturnCreate.type";
import { getThrownMessage, removeAt } from "./ItemReturnCreate.util";
import { stampReturnPhoto } from "./ItemReturnPhoto.util";

import { useUploadImageMutation } from "@/services/master-item.service";

/**
 * Revoke the object URL of a staged photo.
 * @param {StagedPhoto} photo - Staged photo
 * @returns {void} Nothing
 */
const _revokePhoto = (photo: StagedPhoto): void => URL.revokeObjectURL(photo.url);

/**
 * Revoke an object URL.
 * @param {string} url - Object URL
 * @returns {void} Nothing
 */
const _revokeUrl = (url: string): void => URL.revokeObjectURL(url);

/**
 * Stamp captured files sequentially and stage them with preview URLs.
 * @param {File[]} files - Captured files
 * @returns {Promise<StagedPhoto[]>} Staged photos
 */
const _stampPhotos = async (files: File[]): Promise<StagedPhoto[]> => {
  const photos: StagedPhoto[] = [];

  for (const file of files) {
    const stamped = await stampReturnPhoto(file);

    photos.push({ file: stamped, url: URL.createObjectURL(stamped) });
  }

  return photos;
};

/**
 * Manage the photo viewer modal state.
 * @returns {ReturnViewerState} Viewer state
 */
export const useReturnViewer = (): ReturnViewerState => {
  const [viewedPhoto, setViewedPhoto] = useState<ReturnViewedPhoto | null>(null);
  const viewedRef = useRef<ReturnViewedPhoto | null>(null);

  /**
   * Show or clear the viewed photo.
   * @param {ReturnViewedPhoto | null} photo - Photo to show
   * @returns {void} Nothing
   */
  const showPhoto = (photo: ReturnViewedPhoto | null): void => {
    viewedRef.current = photo;
    setViewedPhoto(photo);
  };

  /**
   * Close the viewer.
   * @returns {void} Nothing
   */
  const closeViewedPhoto = (): void => showPhoto(null);

  return { viewedPhoto, viewedRef, showPhoto, closeViewedPhoto };
};

/**
 * Manage the captured photo preview awaiting confirmation.
 * @param {ReturnGuards} guards - Busy guards
 * @returns {ReturnPreviewState} Preview state
 */
export const useReturnPreview = (guards: ReturnGuards): ReturnPreviewState => {
  const [photoPreview, setPhotoPreview] = useState<ReturnPhotoPreview | null>(null);
  const urlsRef = useRef<string[]>([]);
  const pendingRef = useRef<ReturnPendingPhotos | null>(null);

  useEffect(() => (): void => urlsRef.current.forEach(_revokeUrl), []);

  /**
   * Discard the preview and its object URLs unless busy.
   * @returns {void} Nothing
   */
  const closePhotoPreview = (): void => {
    if (guards.upload.current || guards.saving.current) return;

    urlsRef.current.forEach(_revokeUrl);
    urlsRef.current = [];
    pendingRef.current = null;
    setPhotoPreview(null);
  };

  /**
   * Show a preview for captured photos.
   * @param {ReturnPhotoPreview} preview - Preview data
   * @param {StagedPhoto[]} photos - Captured photos
   * @returns {void} Nothing
   */
  const showPreview = (preview: ReturnPhotoPreview, photos: StagedPhoto[]): void => {
    urlsRef.current.forEach(_revokeUrl);
    urlsRef.current = photos.map((photo) => photo.url);
    pendingRef.current = { itemId: preview.itemId, photos };
    setPhotoPreview(preview);
  };

  /**
   * Take the pending photos and clear the preview without revoking URLs.
   * @returns {ReturnPendingPhotos | null} Pending photos
   */
  const takePending = (): ReturnPendingPhotos | null => {
    const pending = pendingRef.current;

    urlsRef.current = [];
    pendingRef.current = null;
    setPhotoPreview(null);

    return pending;
  };

  return { photoPreview, closePhotoPreview, showPreview, takePending };
};

/**
 * Manage photos staged for upload on save.
 * @returns {ReturnStagedState} Staged state
 */
export const useReturnStaged = (): ReturnStagedState => {
  const [stagedPhotos, setStagedPhotos] = useState<Map<string, StagedPhoto[]>>(new Map());
  const stagedRef = useRef<Map<string, StagedPhoto[]>>(new Map());
  const uploadedRef = useRef<ReturnPhotoOverrides>(new Map());

  useEffect(() => (): void => stagedRef.current.forEach((staged) => staged.forEach(_revokePhoto)), []);

  /**
   * Publish the staged ref into state.
   * @returns {void} Nothing
   */
  const syncStaged = (): void => setStagedPhotos(new Map(stagedRef.current));

  /**
   * Get the first staged URL of an item.
   * @param {string} itemId - Item row id
   * @returns {string | undefined} Staged URL
   */
  const getStagedUrl = (itemId: string): string | undefined => stagedRef.current.get(itemId)?.[0]?.url;

  /**
   * Append photos to an item and invalidate its upload.
   * @param {string} itemId - Item row id
   * @param {StagedPhoto[]} photos - Photos to add
   * @returns {void} Nothing
   */
  const addStaged = (itemId: string, photos: StagedPhoto[]): void => {
    stagedRef.current.set(itemId, [...(stagedRef.current.get(itemId) ?? []), ...photos]);
    uploadedRef.current.delete(itemId);
    syncStaged();
  };

  /**
   * Remove one staged photo.
   * @param {string} itemId - Item row id
   * @param {number} photoIndex - Photo index
   * @returns {boolean} Whether a staged photo was removed
   */
  const removeStaged = (itemId: string, photoIndex: number): boolean => {
    const staged = stagedRef.current.get(itemId);

    if (!staged?.[photoIndex]) return false;

    _revokePhoto(staged[photoIndex]);
    const remaining = staged.filter((_photo, index) => index !== photoIndex);

    if (remaining.length) stagedRef.current.set(itemId, remaining);
    else stagedRef.current.delete(itemId);

    syncStaged();

    return true;
  };

  /**
   * Discard all staged photos.
   * @returns {void} Nothing
   */
  const clearStaged = (): void => {
    stagedRef.current.forEach((staged) => staged.forEach(_revokePhoto));
    stagedRef.current.clear();
    syncStaged();
  };

  const stagedPhotoUrls = new Map([...stagedPhotos].map(([itemId, staged]): [string, string[]] => [itemId, staged.map((photo) => photo.url)]));

  return { stagedPhotoUrls, stagedRef, uploadedRef, syncStaged, getStagedUrl, addStaged, removeStaged, clearStaged };
};

/**
 * Manage capturing photos and confirming them into staging.
 * @param {ReturnCaptureInput} input - Capture dependencies
 * @returns {ReturnCaptureState} Capture handlers
 */
export const useReturnCapture = (input: ReturnCaptureInput): ReturnCaptureState => {
  const { guards, preview, staged, fields, orderItems } = input;

  /**
   * Stamp captured files and show them for confirmation.
   * @param {string} itemId - Item row id
   * @param {File[]} files - Captured files
   * @returns {Promise<void>} Completed capture
   */
  const onCaptureItem = async (itemId: string, files: File[]): Promise<void> => {
    const item = orderItems.find((row) => row.id === itemId);

    if (guards.upload.current || guards.saving.current || !item || files.length === 0) return;

    guards.upload.current = true;
    fields.setUploadingItemId(itemId);
    fields.setErrorMessage(null);
    const currentOrderId = guards.orderId.current;

    try {
      const photos = await _stampPhotos(files);

      if (currentOrderId !== guards.orderId.current) photos.forEach(_revokePhoto);
      else preview.showPreview({ itemId, itemName: item.itemName, url: photos[0].url }, photos);
    } catch (error) {
      fields.setErrorMessage(getThrownMessage(error as Error, "Photo processing failed. Retry capture."));
    } finally {
      guards.upload.current = false;
      fields.setUploadingItemId(null);
    }
  };

  /**
   * Move the previewed photos into staging.
   * @returns {void} Nothing
   */
  const confirmPhoto = (): void => {
    if (guards.upload.current || guards.saving.current) return;

    const pending = preview.takePending();

    if (!pending) return;

    staged.addStaged(pending.itemId, pending.photos);
    fields.setErrorMessage(null);
  };

  return { onCaptureItem, confirmPhoto };
};

/**
 * Manage opening and removing item photos.
 * @param {ReturnPhotoActionsInput} input - Action dependencies
 * @returns {ReturnPhotoActionsState} Photo actions
 */
export const useReturnPhotoActions = (input: ReturnPhotoActionsInput): ReturnPhotoActionsState => {
  const { viewer, staged, fields, orderItems } = input;

  /**
   * Open an item photo in the viewer.
   * @param {string} itemId - Item row id
   * @returns {void} Nothing
   */
  const openPhoto = (itemId: string): void => {
    const row = orderItems.find((item) => item.id === itemId);
    const url = staged.getStagedUrl(itemId) ?? row?.fileUrls[0];

    if (row && url) viewer.showPhoto({ itemName: row.itemName, url });
  };

  /**
   * Remove a staged photo, or a saved photo when none is staged at the index.
   * @param {string} itemId - Item row id
   * @param {number} photoIndex - Photo index
   * @returns {void} Nothing
   */
  const onRemovePhoto = (itemId: string, photoIndex: number): void => {
    if (staged.removeStaged(itemId, photoIndex)) return;

    const row = orderItems.find((item) => item.id === itemId);

    if (!row || photoIndex >= row.fileUrls.length) return;

    fields.setPhotoOverrides((current) => new Map(current).set(itemId, {
      fileUrls: removeAt(row.fileUrls, photoIndex),
      fileNames: removeAt(row.fileNames, photoIndex),
    }));
  };

  return { openPhoto, onRemovePhoto };
};

/**
 * Upload the staged photos of one row and release them.
 * @param {ReturnOrderItemRow} row - Item row
 * @param {ReturnUploadInput} input - Upload dependencies
 * @returns {Promise<void>} Completed upload
 */
const _uploadRowPhotos = async (row: ReturnOrderItemRow, input: ReturnUploadInput): Promise<void> => {
  const { upload, staged, viewer, fields } = input;
  const photos = staged.stagedRef.current.get(row.id);

  if (!photos?.length || staged.uploadedRef.current.has(row.id)) return;

  fields.setUploadingItemId(row.id);
  const fileUrls: string[] = [];
  const fileNames: string[] = [];

  for (const photo of photos) {
    const formData = new FormData();

    formData.append("file", photo.file);
    const result = await upload(formData).unwrap();

    if (!result.url || !result.file_name) throw new Error(`Upload returned incomplete photo data for ${row.itemName}.`);

    fileUrls.push(result.url);
    fileNames.push(result.file_name);
  }

  staged.uploadedRef.current.set(row.id, { fileUrls, fileNames });

  if (viewer.viewedRef.current?.url === photos[0].url) viewer.closeViewedPhoto();

  photos.forEach(_revokePhoto);
  staged.stagedRef.current.delete(row.id);
  staged.syncStaged();
};

/**
 * Manage all photo state for the return form.
 * @param {ReturnFieldsState} fields - Form fields
 * @param {ReturnOrderItemRow[]} orderItems - Rows with overrides
 * @returns {ReturnPhotosState} Photo state
 */
export const useReturnPhotos = (fields: ReturnFieldsState, orderItems: ReturnOrderItemRow[]): ReturnPhotosState => {
  const [upload] = useUploadImageMutation();
  const guards: ReturnGuards = { upload: useRef(false), saving: useRef(false), orderId: useRef("") };
  const viewer = useReturnViewer();
  const preview = useReturnPreview(guards);
  const staged = useReturnStaged();
  const capture = useReturnCapture({ guards, preview, staged, fields, orderItems });
  const actions = useReturnPhotoActions({ viewer, staged, fields, orderItems });

  /**
   * Upload staged photos of the given rows and return rows with the uploaded URLs.
   * @param {ReturnOrderItemRow[]} rows - Rows to upload
   * @returns {Promise<ReturnOrderItemRow[]>} Rows with uploaded photos
   */
  const uploadStaged: ReturnUploadStaged = async (rows) => {
    for (const row of rows) await _uploadRowPhotos(row, { upload, staged, viewer, fields });

    fields.setUploadingItemId(null);

    return rows.map((row) => {
      const uploaded = staged.uploadedRef.current.get(row.id);

      return uploaded ? { ...row, ...uploaded } : row;
    });
  };

  /**
   * Discard preview, staged and uploaded photos.
   * @returns {void} Nothing
   */
  const resetPhotos = (): void => {
    preview.closePhotoPreview();
    staged.clearStaged();
    viewer.closeViewedPhoto();
    staged.uploadedRef.current.clear();
  };

  const view = { ...capture, ...actions, photoPreview: preview.photoPreview, closePhotoPreview: preview.closePhotoPreview, stagedPhotoUrls: staged.stagedPhotoUrls, viewedPhoto: viewer.viewedPhoto, closeViewedPhoto: viewer.closeViewedPhoto };

  return { view, guards, resetPhotos, uploadStaged };
};
