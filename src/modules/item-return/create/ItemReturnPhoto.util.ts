import axios from "axios";

import { REVERSE_GEOCODE_URL } from "./ItemReturnCreate.config";
import type { Coordinates, ReturnLocation, ReverseGeocodeResponse } from "./ItemReturnCreate.type";

/**
 * Read the device coordinates from the geolocation API.
 * @returns {Promise<Coordinates>} - Device coordinates
 */
const _getCoordinates = (): Promise<Coordinates> => new Promise((resolve, reject): void => {
  if (!navigator.geolocation) {
    reject(new Error("Location unavailable. Enable location access before taking photo."));

    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }): void => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
    (): void => reject(new Error("Location unavailable. Allow location access and retry.")),
    { enableHighAccuracy: true, timeout: 10000 },
  );
});

/**
 * Resolve device position into human-readable locality for photo evidence.
 * @returns {Promise<ReturnLocation>} Named location and coordinates
 */
export const getReturnLocation = async (): Promise<ReturnLocation> => {
  const coordinates = await _getCoordinates();

  try {
    // Use isolated Axios request: app apiClient would send access token to third-party origin.
    const { data } = await axios.get<ReverseGeocodeResponse>(REVERSE_GEOCODE_URL, {
      params: { latitude: coordinates.latitude, longitude: coordinates.longitude, localityLanguage: "id" },
      timeout: 10000,
    });
    const name = [...new Set([data.locality, data.city, data.principalSubdivision, data.countryName]
      .filter((part): part is string => typeof part === "string" && part.trim().length > 0))].join(", ");

    if (!name || !(data.locality?.trim() || data.city?.trim())) {
      throw new Error("No specific location name returned.");
    }

    return { coordinates, name };
  } catch {
    throw new Error("Location name unavailable. Check connection and retry; photo was not uploaded.");
  }
};

/**
 * Load an object URL into an image element.
 * @param {string} url - Object URL
 * @returns {Promise<HTMLImageElement>} - Loaded image
 */
export const _loadImage = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject): void => {
  const image = new Image();

  image.addEventListener("load", (): void => resolve(image));
  image.addEventListener("error", (): void => reject(new Error("Photo cannot be opened. Take another photo.")));
  image.src = url;
});

/**
 * Draw the image with a caption box at the bottom-left corner.
 * @param {HTMLImageElement} image - Source image
 * @param {string[]} lines - Caption lines
 * @returns {HTMLCanvasElement} - Stamped canvas
 */
export const _drawStamp = (image: HTMLImageElement, lines: string[]): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");

  if (!context || !canvas.width || !canvas.height) {
    throw new Error("Photo cannot be processed. Take another photo.");
  }

  context.drawImage(image, 0, 0);
  const fontSize = Math.max(16, Math.round(canvas.width * 0.025));

  context.font = `${fontSize}px sans-serif`;
  const padding = Math.round(fontSize * 0.75);
  const lineHeight = Math.round(fontSize * 1.4);
  const width = Math.max(...lines.map((line) => context.measureText(line).width)) + padding * 2;
  const height = lineHeight * lines.length + padding * 2;

  context.fillStyle = "rgba(0, 0, 0, 0.75)";
  context.fillRect(0, canvas.height - height, Math.min(width, canvas.width), height);
  context.fillStyle = "#fff";
  lines.forEach((line, index): void => {
    context.fillText(line, padding, canvas.height - height + padding + lineHeight * (index + 0.8));
  });

  return canvas;
};

/**
 * Encode a canvas as a JPEG blob.
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @returns {Promise<Blob>} - JPEG blob
 */
export const _canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => new Promise((resolve, reject): void => {
  canvas.toBlob((result): void => {
    if (result) {
      resolve(result);

      return;
    }

    reject(new Error("Photo cannot be processed. Take another photo."));
  }, "image/jpeg", 0.9);
});

/**
 * Add capture time and readable location directly to photo pixels.
 * @param {File} file - Captured image
 * @returns {Promise<File>} - Stamped JPEG
 */
export const stampReturnPhoto = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Select an image captured with camera.");
  }

  const location = await getReturnLocation();
  const capturedAt = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "medium" });
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await _loadImage(objectUrl);
    const blob = await _canvasToBlob(_drawStamp(image, [capturedAt, `Lokasi: ${location.name}`]));

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-return.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
