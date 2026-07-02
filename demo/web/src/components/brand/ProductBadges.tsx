export function ProductBadges() {
  const badges = [
    { label: "BaseStore", detail: "LangGraph native" },
    { label: "Filecoin FOC", detail: "Content-addressed" },
    { label: "FVM manifest", detail: "Periodic anchor" },
    { label: "Open source", detail: "Apache 2.0" },
  ];

  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-mem-line pt-6 sm:grid-cols-4">
      {badges.map((b) => (
        <div key={b.label}>
          <dt className="text-sm font-medium text-mem-frost">{b.label}</dt>
          <dd className="mt-0.5 text-xs text-mem-muted">{b.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
