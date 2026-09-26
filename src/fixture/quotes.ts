import type { QuoteData } from "../app/quotes/Quotes.type";

export const MOCK_QUOTES: QuoteData[] = [
  {
    id: "1",
    name: "Wedding Reception",
    startDate: "2024-12-01",
    endDate: "2024-12-02",
    location: "Grand Ballroom",
    category: "Sound System",
    selectedItems: ["Speaker Active 15 inch", "Microphone Wireless"],
    qty: 2,
    pph: 11,
    discount: 500000,
    remark: "Setup by 10 AM",
    status: "Completed",
  },
  {
    id: "2",
    name: "Youth Camp GPdI 2026",
    startDate: "2026-06-30",
    endDate: "2026-07-02",
    location: "Kebun Pines, Cikole, Lembang - Bandung",
    category: "Sound System, Backline, Lighting, LED Screen",
    selectedItems: [
      "Midas M32 LIVE / Behringer Wing 48 Channel",
      "Peavey DLMS",
      "Krezt A3 12\" line array",
      "Sennheiser/shure handheld wireless microphones",
      "Sonor acoustic drums AQ2 + Symbals",
      "Beam 290",
      "Modul LED (Rp 400.000 x 15 Meter)",
    ],
    qty: 2,
    pph: 11,
    discount: 12750000,
    remark: "** INCLUDE OPERATOR DAN CREW BERPENGALAMAN DI EVENT GEREJA",
    status: "Completed",
  },
];

export const MOCK_ORDER_ITEMS: Record<string, string[]> = {
  "Sound System": ["Speaker Active 15 Inch", "Microphone Wireless", "Mixer 16 Channel", "Subwoofer"],
  "Lighting": ["Par LED", "Moving Head", "Follow Spot", "Smoke Machine"],
  "Staging": ["Stage 4x6m", "Rigging 6x8m", "Backdrop", "Tent 10x10m"],
  "Backline": ["Sonor acoustic drums AQ2 + Symbals", "Roland electric piano RD700 + Stand", "Yamaha bass 435 + Stand", "Yamaha guitar pasifica + Stand"],
  "LED Screen": ["Modul LED (Rp 400.000 x 15 Meter)", "Procesor + kabel HDMI", "Kabel LAN 50 meter", "Laptop I7"],
};
