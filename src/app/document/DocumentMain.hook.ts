import { useEffect, useState } from "react";

import invoiceIllustration from "@/assets/invoice-illustration.webp";
import paymentIllustration from "@/assets/payment-illustration.webp";
import quotationIllustration from "@/assets/quotation-illustration.webp";

/**
 * Detect mobile document layout viewport.
 * @returns {boolean} Whether viewport uses mobile layout
 */
export const useDocumentMobileViewport = (): boolean => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

/**
 * Preload document illustrations before showing document cards.
 * @returns {boolean} Whether all document illustrations finished loading
 */
export const useDocumentIllustrationsLoaded = (): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sources = [quotationIllustration, invoiceIllustration, paymentIllustration];
    let loadedCount = 0;
    const markLoaded = (): void => {
      loadedCount += 1;
      if (loadedCount === sources.length && isMounted) {
        setIsLoaded(true);
      }
    };

    sources.forEach((source) => {
      const image = new Image();
      image.onload = markLoaded;
      image.onerror = markLoaded;
      image.src = source;
      if (image.complete) markLoaded();
    });

    return (): void => {
      isMounted = false;
    };
  }, []);

  return isLoaded;
};
