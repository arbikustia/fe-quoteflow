import type { ItemData } from "../app/master-item/MasterItem.type";

export const MOCK_ITEMS: ItemData[] = [
  // Audio System
  { id: "101", name: "Line Array Speaker", category: "Audio System", unit: "Set", price: 5000000, remark: "High quality sound" },
  { id: "102", name: "Subwoofer 18\"", category: "Audio System", unit: "Pcs", price: 1500000, remark: "Deep bass" },
  { id: "103", name: "Digital Audio Mixer 32 Ch", category: "Audio System", unit: "Unit", price: 3000000, remark: "Including stage box" },
  { id: "104", name: "Wireless Microphone", category: "Audio System", unit: "Set", price: 500000, remark: "Shure / Sennheiser" },
  { id: "105", name: "In-Ear Monitor", category: "Audio System", unit: "Set", price: 800000, remark: "For performers" },
  
  // Visual & Display
  { id: "201", name: "LED Screen P3.9", category: "Visual & Display", unit: "Sqm", price: 1200000, remark: "Indoor use" },
  { id: "202", name: "Seamless TV 55\"", category: "Visual & Display", unit: "Unit", price: 1000000, remark: "With floor stand" },
  { id: "203", name: "Projector 10000 Lumens", category: "Visual & Display", unit: "Unit", price: 4500000, remark: "Including screen 3x4m" },
  { id: "204", name: "Video Switcher Seamless", category: "Visual & Display", unit: "Unit", price: 2500000, remark: "Roland / Datavideo" },
  { id: "205", name: "Teleprompter 17\"", category: "Visual & Display", unit: "Unit", price: 1500000, remark: "Including operator" },

  // Lighting System
  { id: "301", name: "Moving Head Beam 230W", category: "Lighting System", unit: "Pcs", price: 600000, remark: "Sharp beam effect" },
  { id: "302", name: "Par LED 54x3W RGBW", category: "Lighting System", unit: "Pcs", price: 250000, remark: "Wash lighting" },
  { id: "303", name: "Follow Spot 330W", category: "Lighting System", unit: "Unit", price: 1500000, remark: "Including operator" },
  { id: "304", name: "Lighting Console", category: "Lighting System", unit: "Unit", price: 2000000, remark: "Avolites / GrandMA" },
  { id: "305", name: "Hazer Machine", category: "Lighting System", unit: "Unit", price: 800000, remark: "For beam enhancement" },

  // Staging & Rigging
  { id: "401", name: "Stage Deck 1x2m", category: "Staging & Rigging", unit: "Pcs", price: 150000, remark: "Height 20-100cm" },
  { id: "402", name: "Aluminium Truss 3m", category: "Staging & Rigging", unit: "Pcs", price: 350000, remark: "Rigging structural" },
  { id: "403", name: "Chain Hoist 1 Ton", category: "Staging & Rigging", unit: "Unit", price: 750000, remark: "Electric hoist" },
  { id: "404", name: "Scaffolding Set", category: "Staging & Rigging", unit: "Set", price: 50000, remark: "Main frame + cross brace" },
  { id: "405", name: "Stage Skirting", category: "Staging & Rigging", unit: "Meter", price: 20000, remark: "Black color" },

  // Power Generator
  { id: "501", name: "Genset 60 KVA", category: "Power Generator", unit: "Unit", price: 3500000, remark: "Including BBM & Operator 10h" },
  { id: "502", name: "Genset 100 KVA", category: "Power Generator", unit: "Unit", price: 4500000, remark: "Including BBM & Operator 10h" },
  { id: "503", name: "Power Distribution Box", category: "Power Generator", unit: "Unit", price: 800000, remark: "63A 3-Phase Panel" },
  { id: "504", name: "Cable 3 Phase (50m)", category: "Power Generator", unit: "Roll", price: 500000, remark: "Main cable" },
  { id: "505", name: "UPS 10 KVA", category: "Power Generator", unit: "Unit", price: 1500000, remark: "For critical loads" },

  // IT & Network
  { id: "601", name: "Router Mikrotik", category: "IT & Network", unit: "Unit", price: 400000, remark: "Bandwidth management" },
  { id: "602", name: "Access Point Unifi", category: "IT & Network", unit: "Unit", price: 350000, remark: "High density WiFi" },
  { id: "603", name: "Switch Hub 24 Port Gigabit", category: "IT & Network", unit: "Unit", price: 250000, remark: "Manageable switch" },
  { id: "604", name: "UTP Cable Cat6 (100m)", category: "IT & Network", unit: "Roll", price: 300000, remark: "Belden / Commscope" },
  { id: "605", name: "Laptop Core i7", category: "IT & Network", unit: "Unit", price: 800000, remark: "Show laptop" },

  // Furniture
  { id: "701", name: "Banquet Chair", category: "Furniture", unit: "Pcs", price: 20000, remark: "Including cover & ribbon" },
  { id: "702", name: "Round Table 120cm", category: "Furniture", unit: "Pcs", price: 150000, remark: "Including cover" },
  { id: "703", name: "Sofa VIP 1 Seater", category: "Furniture", unit: "Pcs", price: 400000, remark: "Leather, black/white" },
  { id: "704", name: "Bar Stool", category: "Furniture", unit: "Pcs", price: 100000, remark: "Hydraulic, black/white" },
  { id: "705", name: "Dealing Table", category: "Furniture", unit: "Pcs", price: 150000, remark: "Glass top" },

  // Photography & Videography
  { id: "801", name: "Mirrorless Camera Sony A7IV", category: "Photography & Videography", unit: "Unit", price: 1200000, remark: "Body + Lens" },
  { id: "802", name: "Camcorder Sony NX100", category: "Photography & Videography", unit: "Unit", price: 800000, remark: "For documentation" },
  { id: "803", name: "Tripod Video Fluid Head", category: "Photography & Videography", unit: "Unit", price: 250000, remark: "Libec / Manfrotto" },
  { id: "804", name: "Video Capture Card", category: "Photography & Videography", unit: "Unit", price: 200000, remark: "Blackmagic / Elgato" },
  { id: "805", name: "Jimmy Jib 9m", category: "Photography & Videography", unit: "Set", price: 4500000, remark: "Including operator" },

  // Translation & Interpretation
  { id: "901", name: "Interpreter Booth", category: "Translation & Interpretation", unit: "Unit", price: 2500000, remark: "Soundproof booth" },
  { id: "902", name: "Interpreter Console", category: "Translation & Interpretation", unit: "Unit", price: 800000, remark: "For 2 interpreters" },
  { id: "903", name: "IR Transmitter", category: "Translation & Interpretation", unit: "Unit", price: 1000000, remark: "Infrared radiator" },
  { id: "904", name: "IR Receiver Headset", category: "Translation & Interpretation", unit: "Pcs", price: 50000, remark: "For participants" },
  { id: "905", name: "Central Control Unit SIS", category: "Translation & Interpretation", unit: "Unit", price: 1500000, remark: "Main controller" },

  // Special Effects
  { id: "1001", name: "Confetti Machine", category: "Special Effects", unit: "Unit", price: 750000, remark: "Including 1kg confetti paper" },
  { id: "1002", name: "Dry Ice Machine", category: "Special Effects", unit: "Unit", price: 1500000, remark: "Low fog effect" },
  { id: "1003", name: "Cold Spark Machine", category: "Special Effects", unit: "Unit", price: 800000, remark: "Indoor fireworks (safe)" },
  { id: "1004", name: "CO2 Jet Machine", category: "Special Effects", unit: "Unit", price: 1200000, remark: "Including CO2 tank" },
  { id: "1005", name: "Bubble Machine", category: "Special Effects", unit: "Unit", price: 400000, remark: "Including bubble liquid" }
];
