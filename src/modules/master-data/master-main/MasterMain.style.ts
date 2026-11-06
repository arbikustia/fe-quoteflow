import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #F5F7FA",
  },
};

export default styles;
