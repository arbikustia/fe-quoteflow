import axios from "axios";

import { REVERSE_GEOCODE_URL } from "./ItemReturnCreate.config";
import type { Coordinates, ReturnLocation, ReverseGeocodeResponse } from "./ItemReturnCreate.type";

/**
 *
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

/** Resolve device position into human-readable locality for photo evidence.
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

/** Add capture time and readable location directly to photo pixels.
 * @param {File} file - Captured image
 * @returns {Promise<File>} Stamped JPEG
 */
export const stampReturnPhoto = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Select an image captured with camera.");
  }

  const location = await getReturnLocation();
  const capturedAt = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "medium" });
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject): void => {
      /**
       *
       */
      image.onload = (): void => resolve();
      /**
       *
       */
      image.onerror = (): void => reject(new Error("Photo cannot be opened. Take another photo."));
      image.src = objectUrl;
    });

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
    const lines = [capturedAt, `Lokasi: ${location.name}`];
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

    const blob = await new Promise<Blob>((resolve, reject): void => {
      canvas.toBlob((result): void => {
        if (result) resolve(result);
        else reject(new Error("Photo cannot be processed. Take another photo."));
      }, "image/jpeg", 0.9);
    });

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-return.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
