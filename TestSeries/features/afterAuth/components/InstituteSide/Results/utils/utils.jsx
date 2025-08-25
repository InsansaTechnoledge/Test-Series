export const formatDateIST = (iso) => {
    if (!iso) return "-";
    try {
      return new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };
  
export const toNumber = (v, def = 0) => (typeof v === "number" ? v : def);