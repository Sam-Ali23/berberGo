export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="panel p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-black text-slate-950">{value}</strong>
        {accent ? <span className="text-xs font-semibold text-slate-400">{accent}</span> : null}
      </div>
    </div>
  );
}
