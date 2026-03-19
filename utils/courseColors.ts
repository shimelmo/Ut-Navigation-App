export const getCourseDayColorSet = (days: string[]) => {
  const normalizedDays = (days || []).map((day) => day.toLowerCase().trim());

  const hasMonday = normalizedDays.includes("monday");
  const hasWednesday = normalizedDays.includes("wednesday");
  const hasTuesday = normalizedDays.includes("tuesday");
  const hasThursday = normalizedDays.includes("thursday");
  const hasFriday = normalizedDays.includes("friday");

  if (hasMonday || hasWednesday) {
    return {
      backgroundColor: "#eef5ff",
      borderColor: "#bcd4ff",
      titleColor: "#1d4f91",
      textColor: "#35527d",
    };
  }

  if (hasTuesday || hasThursday) {
    return {
      backgroundColor: "#fff3e8",
      borderColor: "#f5c89d",
      titleColor: "#9a4d00",
      textColor: "#875422",
    };
  }

  if (hasFriday) {
    return {
      backgroundColor: "#eefbf0",
      borderColor: "#b9e2bf",
      titleColor: "#2d6a39",
      textColor: "#426a49",
    };
  }

  return {
    backgroundColor: "#fff9eb",
    borderColor: "#f1e2b5",
    titleColor: "#5d4c16",
    textColor: "#735f22",
  };
};