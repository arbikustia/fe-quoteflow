import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_QUOTES } from "../../../fixture/quotes";
import { generateQuotePDF } from "../../../utils/pdfGenerator";
import type { QuoteData } from "../../order/desktop-order/DesktopOrder.type";

import type {
  MobileReturnDetailProps,
  UseItemFilesReturn,
} from "./MobileReturnDetail.type";

/**
 * Fetches the geocoded location string from latitude and longitude
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} The location string
 */
const fetchGeocodedLocation = async (
  lat: number,
  lon: number,
): Promise<string> => {
  try {
    // eslint-disable-next-line
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`,
    );
    const data = await res.json();

    if (data) {
      const parts = [
        data.locality,
        data.city,
        data.principalSubdivision,
      ].filter(Boolean);

      if (parts.length > 0) return Array.from(new Set(parts)).join(", ");
    }

    return `Lat: ${lat.toFixed(5)}, Lng: ${lon.toFixed(5)}`;
  } catch {
    return `Lat: ${lat.toFixed(5)}, Lng: ${lon.toFixed(5)}`;
  }
};

/**
 * Hook to get the user's current location as a formatted string
 * @returns {string} The location string
 */
const useGeolocation = (): string => {
  const [location, setLocation] = useState<string>("Location unknown");

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        void fetchGeocodedLocation(
          pos.coords.latitude,
          pos.coords.longitude,
        ).then(setLocation),
      () => {
        /* ignore */
      },
      { enableHighAccuracy: true },
    );
  }, []);

  return location;
};

/**
 * Draws a watermark on a canvas from an image
 * @param {HTMLImageElement} img - The image element
 * @param {string} location - The location string
 * @returns {string} Data URL
 */
const drawWatermarkOnCanvas = (
  img: HTMLImageElement,
  location: string,
): string => {
  const canvas = document.createElement("canvas");

  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  ctx.drawImage(img, 0, 0);
  const fSize = Math.max(16, Math.floor(img.width * 0.035));

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, img.height - (fSize * 2 + 40), img.width, fSize * 2 + 40);
  ctx.fillStyle = "white";
  ctx.font = `${fSize}px sans-serif`;
  ctx.textBaseline = "top";

  const opts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const dateStr = new Date().toLocaleString("id-ID", opts);

  ctx.fillText(dateStr, 20, img.height - (fSize * 2 + 20));
  ctx.fillText(`Loc: ${location}`, 20, img.height - (fSize + 10));

  return canvas.toDataURL("image/jpeg", 0.85);
};

/**
 * Processes an image file by drawing a watermark with the current date and location
 * @param {File} file - The image file
 * @param {string} location - The location string to draw
 * @returns {Promise<string>} A promise that resolves to the processed image data URL
 */
const processImageWatermark = async (
  file: File,
  location: string,
): Promise<string> => {
  const tempUrl = URL.createObjectURL(file);
  const img = new Image();

  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = tempUrl;
  });

  const result = drawWatermarkOnCanvas(img, location);

  URL.revokeObjectURL(tempUrl);

  return result;
};

/**
 * Creates a file change handler bound to state setter and location
 * @param {React.Dispatch<React.SetStateAction<Record<number, { name: string; url: string }>>>} setItemFiles - state setter
 * @param {string} location - location string for watermark
 * @returns {UseItemFilesReturn["handleFileChange"]} - handler
 */
const _createHandleFileChange =
  (
    setItemFiles: React.Dispatch<
      React.SetStateAction<Record<number, { name: string; url: string }>>
    >,
    location: string,
  ): UseItemFilesReturn["handleFileChange"] =>
  (idx, e) => {
    const file = e.target.files?.[0];

    if (file) {
      processImageWatermark(file, location)
        .then((url) => {
          setItemFiles((prev) => ({
            ...prev,
            [idx]: { name: `marked_${file.name}`, url },
          }));
        })
        .catch(() => {
          /* ignore */
        });
    }
  };

/**
 * Creates a remove file handler bound to state setter
 * @param {React.Dispatch<React.SetStateAction<Record<number, { name: string; url: string }>>>} setItemFiles - state setter
 * @returns {UseItemFilesReturn["removeFile"]} - handler
 */
const _createRemoveFile =
  (
    setItemFiles: React.Dispatch<
      React.SetStateAction<Record<number, { name: string; url: string }>>
    >,
  ): UseItemFilesReturn["removeFile"] =>
  (idx) => {
    setItemFiles((prev) => {
      const next = { ...prev };

      if (next[idx]) {
        URL.revokeObjectURL(next[idx].url);
        delete next[idx];
      }

      return next;
    });
  };

/**
 * Hook to manage item files and their watermark processing
 * @param {string} location - The location string for watermarks
 * @returns {UseItemFilesReturn} The item files state and related handlers
 */
const useItemFiles = (location: string): UseItemFilesReturn => {
  const [itemFiles, setItemFiles] = useState<
    Record<number, { name: string; url: string }>
  >({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const handleFileChange = _createHandleFileChange(setItemFiles, location);
  const removeFile = _createRemoveFile(setItemFiles);

  return {
    itemFiles,
    previewImage,
    setPreviewImage,
    handleFileChange,
    removeFile,
  };
};

/**
 * Hook for Mobile Return Detail
 * @returns {MobileReturnDetailProps} hook values
 */
export const useMobileReturnDetail = (): MobileReturnDetailProps => {
  const navigate = useNavigate();
  const { id } = useParams();
  const order = MOCK_QUOTES.find((q) => q.id === id) || MOCK_QUOTES[0];
  const [showToast, setShowToast] = useState(false);
  const location = useGeolocation();
  const items = useItemFiles(location);

  /**
   * Handle save
   * @returns {void}
   */
  const handleSave = (): void => {
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate("/return");
    }, 1500);
  };

  /**
   * Handle back navigation
   * @returns {void} void
   */
  const onBack = (): void => {
    navigate(-1);
  };

  /**
   * Handle download PDF
   * @returns {void} void
   */
  const onDownload = (): void => {
    generateQuotePDF(order as QuoteData);
  };

  return {
    order,
    location,
    showToast,
    handleSave,
    onBack,
    onDownload,
    ...items,
  };
};
