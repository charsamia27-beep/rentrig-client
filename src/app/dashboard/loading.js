export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-3xl" />
        ))}
      </div>
      <div className="skeleton h-80 rounded-3xl" />
    </div>
  );
}
