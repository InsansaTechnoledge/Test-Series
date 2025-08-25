
const classNames = (...xs) => xs.filter(Boolean).join(" ");

export const StatCard = ({ title, value }) => (
  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 p-6 shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:shadow-indigo-100/70 transition-all duration-300">
    <div className="text-xs uppercase tracking-wider text-gray-600/70 font-medium">{title}</div>
    <div className="mt-2 text-3xl font-bold text-indigo-900">{value}</div>
    {/* <div className="mt-1 h-1 w-12 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"></div> */}
  </div>
);

export const SkeletonTable = () => (
  <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg shadow-indigo-100/50">
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-1/3 rounded-lg bg-gradient-to-r from-indigo-200 to-indigo-100" />
      <div className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-100 to-indigo-50" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 w-full rounded-xl bg-gradient-to-r from-indigo-50 to-gray-50" />
      ))}
    </div>
  </div>
);

export const TrHead = ({ children }) => (
  <tr className="bg-gray-100">
    {children}
  </tr>
);

export const Th = ({ children, onClick, active, dir, className }) => (
  <th
    onClick={onClick}
    className={classNames(
      "px-6 py-4 text-left text-xs font-bold uppercase tracking-wider select-none transition-all duration-200",
      onClick && "cursor-pointer hover:bg-indigo-100/60",
      active ? "text-indigo-700 bg-indigo-100/70" : "text-gray-900/80",
      className
    )}
  >
    <div className="inline-flex items-center gap-2">
      {children}
      {active && (
        <span className="text-indigo-500 font-bold text-sm">
          {dir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </div>
  </th>
);

export const Td = ({ children, className }) => (
  <td className={classNames("px-6 py-4 align-middle text-sm text-gray-700", className)}>
    {children}
  </td>
);

export const SummaryPill = ({ label, value }) => (
  <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50/40 p-4 shadow-md shadow-indigo-100/40 hover:shadow-lg hover:shadow-indigo-100/60 transition-all duration-200">
    <div className="text-[10px] uppercase tracking-wider text-indigo-600/70 font-semibold">{label}</div>
    <div className="text-xl font-bold text-indigo-900 mt-1">{String(value)}</div>
  </div>
);

export const EmptyLine = ({ text }) => (
  <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 px-4 py-3 text-sm text-indigo-600/80 font-medium">
    {text}
  </div>
);

export const Codeish = ({ value }) => {
  let display;
  try {
    display = Array.isArray(value) ? JSON.stringify(value) : String(value);
  } catch {
    display = String(value);
  }
  return (
    <code className="rounded-lg bg-indigo-50/80 border border-indigo-200/60 px-2 py-1 text-[11px] font-mono text-indigo-800 shadow-sm">
      {display}
    </code>
  );
};