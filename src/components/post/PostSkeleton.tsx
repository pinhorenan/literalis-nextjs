// File: src/components/post/PostSkeleton.tsx

export default function PostSkeleton() {
  return (
    <article className="w-full border-b border-[var(--border-base)] animate-pulse">
      <div className="flex flex-col md:flex-row p-4 gap-4">
        <div className="flex gap-4 basis-4/7">
          <div className="bg-[var(--surface-card)] border border-[var(--border-base)] rounded w-[120px] h-[180px]" />
          <div className="flex flex-col flex-1 space-y-2">
            <div className="h-6 w-2/3 bg-[var(--surface-card)] rounded" />
            <div className="h-4 w-1/2 bg-[var(--surface-card)] rounded" />
            <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded" />
          </div>
        </div>

        <div className="flex flex-col basis-3/7 space-y-4">
          <div className="h-4 w-1/2 bg-[var(--surface-card)] rounded" />
          <div className="h-24 bg-[var(--surface-card)] rounded" />
          <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded self-end" />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--border-base)] p-4">
        <div className="h-[30px] w-[30px] bg-[var(--surface-card)] rounded-full" />
        <div className="h-[25px] w-[15px] bg-[var(--surface-card)] rounded" />
        <div className="h-[30px] w-[30px] bg-[var(--surface-card)] rounded-full" />
        <div className="h-[25px] w-[15px] bg-[var(--surface-card)] rounded" />
        <div className="flex-1 h-8 bg-[var(--surface-card)] rounded" />
      </div>

      <div className="px-4 py-2 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-[30px] w-[30px] bg-[var(--surface-card)] rounded-full" />
            <div className="h-4 w-3/4 bg-[var(--surface-card)] rounded" />
          </div>
        ))}
      </div>
    </article>
  );
}
