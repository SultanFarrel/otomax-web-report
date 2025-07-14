import { DateValue, RangeValue } from "@heroui/calendar";

const formatCurrency = (amount: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    ...options,
  }).format(amount);

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "UTC",
};

const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
) => {
  const formatOptions = options
    ? { timeZone: "UTC", ...options }
    : DEFAULT_DATE_OPTIONS;
  return new Intl.DateTimeFormat("id-ID", formatOptions).format(
    new Date(dateString)
  );
};

const formatDateRange = (range: RangeValue<DateValue> | null) => {
  if (!range) return "Pilih Tanggal";

  const format = (date: DateValue) => {
    const day = String(date.day).padStart(2, "0");
    const month = String(date.month).padStart(2, "0");
    const year = date.year;
    return `${day}/${month}/${year}`;
  };

  const start = format(range.start);
  const end = format(range.end);

  return `${start} - ${end}`;
};

export { formatCurrency, formatDate, formatDateRange };
