export const getCourseDayColorSet = (
  days: string[],
  useCourseColors: boolean = true,
  darkMode: boolean = false
) => {
  if (!useCourseColors) {
    if (darkMode) {
      return {
        backgroundColor: "#1f2937",
        borderColor: "#334155",
        titleColor: "#e5eefc",
        textColor: "#cbd5e1",
      };
    }

    return {
      backgroundColor: "#fff9eb",
      borderColor: "#f1e2b5",
      titleColor: "#5d4c16",
      textColor: "#735f22",
    };
  }

  const normalizedDays = (days || []).map((day) => day.toLowerCase().trim());

  const hasMonday = normalizedDays.includes("monday");
  const hasWednesday = normalizedDays.includes("wednesday");
  const hasTuesday = normalizedDays.includes("tuesday");
  const hasThursday = normalizedDays.includes("thursday");
  const hasFriday = normalizedDays.includes("friday");

  if (hasMonday || hasWednesday) {
    if (darkMode) {
      return {
        backgroundColor: "#1e3a5f",
        borderColor: "#3b82f6",
        titleColor: "#dbeafe",
        textColor: "#bfdbfe",
      };
    }

    return {
      backgroundColor: "#eef5ff",
      borderColor: "#bcd4ff",
      titleColor: "#1d4f91",
      textColor: "#35527d",
    };
  }

  if (hasTuesday || hasThursday) {
    if (darkMode) {
      return {
        backgroundColor: "#5a3418",
        borderColor: "#f59e0b",
        titleColor: "#ffedd5",
        textColor: "#fed7aa",
      };
    }

    return {
      backgroundColor: "#fff3e8",
      borderColor: "#f5c89d",
      titleColor: "#9a4d00",
      textColor: "#875422",
    };
  }

  if (hasFriday) {
    if (darkMode) {
      return {
        backgroundColor: "#153b2d",
        borderColor: "#22c55e",
        titleColor: "#dcfce7",
        textColor: "#bbf7d0",
      };
    }

    return {
      backgroundColor: "#eefbf0",
      borderColor: "#b9e2bf",
      titleColor: "#2d6a39",
      textColor: "#426a49",
    };
  }

  if (darkMode) {
    return {
      backgroundColor: "#1f2937",
      borderColor: "#334155",
      titleColor: "#e5eefc",
      textColor: "#cbd5e1",
    };
  }

  return {
    backgroundColor: "#fff9eb",
    borderColor: "#f1e2b5",
    titleColor: "#5d4c16",
    textColor: "#735f22",
  };
};