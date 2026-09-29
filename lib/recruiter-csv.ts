/**
 * Client-side CSV download. Proper quoting: a field is wrapped in double
 * quotes when it contains a comma, quote, or newline; internal quotes are
 * doubled. null/undefined become empty cells.
 */
export function downloadCsv(
  filename: string,
  rows: Array<Record<string, string | number | null | undefined>>,
): void {
  if (typeof document === "undefined") return;
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const quote = (v: string | number | null | undefined): string => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.map(quote).join(","),
    ...rows.map((row) => headers.map((h) => quote(row[h])).join(",")),
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
