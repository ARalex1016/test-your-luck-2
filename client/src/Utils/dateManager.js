export const formatDate = (isoString) => {
  return new Date(isoString).toISOString().split("T")[0];
};

export const formatDateWithMonth = (dateString) => {
  const date = new Date(dateString);

  const options = { day: "2-digit", month: "long", year: "numeric" };

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-UK", options)
    .format(date)
    .replace(",", "");
};
