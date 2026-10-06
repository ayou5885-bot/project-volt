export function formatDZD(n: number | string, lang: "en" | "ar" = "en") {
  const v = Math.round(Number(n) || 0).toLocaleString("en-US");
  return lang === "ar" ? `${v} د.ج` : `${v} DZD`;
}
