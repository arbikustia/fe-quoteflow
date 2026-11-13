import axios from "axios";

import { REVERSE_GEOCODE_URL } from "./ItemReturnCreate.config";
import { getReturnLocation, stampReturnPhoto } from "./ItemReturnPhoto.util";

jest.mock("axios");

const mockGeolocation = (latitude: number, longitude: number): void => {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: (success: PositionCallback): void => {
      success({ coords: { latitude, longitude } } as GeolocationPosition);
    } },
  });
};

const originalGeolocation = navigator.geolocation;

afterEach(() => {
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: originalGeolocation });
  jest.clearAllMocks();
});

describe("getReturnLocation", () => {
  it("should return distinct readable location parts from reverse geocoding", async () => {
    mockGeolocation(-6.2, 106.8);
    jest.mocked(axios.get).mockResolvedValueOnce({ data: {
      locality: "Menteng", city: "Jakarta Pusat", principalSubdivision: "DKI Jakarta", countryName: "Indonesia",
    } });

    await expect(getReturnLocation()).resolves.toEqual({
      coordinates: { latitude: -6.2, longitude: 106.8 },
      name: "Menteng, Jakarta Pusat, DKI Jakarta, Indonesia",
    });
    expect(axios.get).toHaveBeenCalledWith(REVERSE_GEOCODE_URL, {
      params: { latitude: -6.2, longitude: 106.8, localityLanguage: "id" }, timeout: 10000,
    });
  });

  it("should fail rather than substitute coordinates when geocoding has no name", async () => {
    mockGeolocation(-6.2, 106.8);
    jest.mocked(axios.get).mockResolvedValueOnce({ data: {} });

    await expect(getReturnLocation()).rejects.toThrow("Location name unavailable. Check connection and retry; photo was not uploaded.");
  });

  it("should reject country-only result without a readable local area", async () => {
    mockGeolocation(-6.2, 106.8);
    jest.mocked(axios.get).mockResolvedValueOnce({ data: { countryName: "Indonesia" } });

    await expect(getReturnLocation()).rejects.toThrow("Location name unavailable. Check connection and retry; photo was not uploaded.");
  });

  it("should fail rather than substitute coordinates when geocoding request fails", async () => {
    mockGeolocation(-6.2, 106.8);
    jest.mocked(axios.get).mockRejectedValueOnce(new Error("Network error"));

    await expect(getReturnLocation()).rejects.toThrow("Location name unavailable. Check connection and retry; photo was not uploaded.");
  });
});

describe("stampReturnPhoto", () => {
  it("should reject image when location access is unavailable", async () => {
    const originalGeolocation = navigator.geolocation;
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });

    try {
      await expect(stampReturnPhoto(new File(["image"], "photo.jpg", { type: "image/jpeg" })))
        .rejects.toThrow("Location unavailable. Enable location access before taking photo.");
    } finally {
      Object.defineProperty(navigator, "geolocation", { configurable: true, value: originalGeolocation });
    }
  });

  it("should reject non-image before requesting location", async () => {
    await expect(stampReturnPhoto(new File(["text"], "photo.txt", { type: "text/plain" })))
      .rejects.toThrow("Select an image captured with camera.");
  });
});
