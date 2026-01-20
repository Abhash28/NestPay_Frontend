const formatMonthYear = (yearMonth) => {
  if (!yearMonth) return "-";

  const [year, month] = yearMonth.split("-");
  const date = new Date(year, month - 1);

  return date.toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });
};
export default formatMonthYear;
