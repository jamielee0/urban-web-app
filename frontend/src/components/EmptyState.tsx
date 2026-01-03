interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: 'rgba(255,255,255,.40)', opacity: 0.6 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,.66)' }}>{message}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            onClick={onAction}
            className="px-4 py-2 rounded-[14px] font-semibold cursor-pointer"
            style={{
              border: '1px solid rgba(255,255,255,.14)',
              background: 'linear-gradient(180deg, rgba(127,224,255,.15), rgba(156,255,134,.12))',
              color: 'var(--text)',
              boxShadow: '0 10px 28px rgba(0,0,0,.35)'
            }}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
