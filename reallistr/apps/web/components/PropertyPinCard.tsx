// reallistr/apps/web/components/PropertyPinCard.tsx
import Image from "next/image";
import clsx from "clsx";

type Badge = "New" | "Bargain" | "Reduced" | "Featured";

export type PropertyPinCardProps = {
  id: number | string;
  title: string;
  price: number;
  imageUrl?: string;
  address?: string;
  createdAt?: string; // ISO string
  badges?: Badge[];
  distanceKm?: number; // e.g., from user
  onView?: (id: number | string) => void;
  onDirections?: (id: number | string) => void;
  className?: string;
};

export default function PropertyPinCard({
  id,
  title,
  price,
  imageUrl,
  address,
  createdAt,
  badges = [],
  distanceKm,
  onView,
  onDirections,
  className,
}: PropertyPinCardProps) {
  const prettyTime = createdAt
    ? new Date(createdAt).toLocaleString()
    : undefined;

  return (
    <div
      className={clsx(
        "w-[320px] max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-sm",
        "overflow-hidden",
        className
      )}
      role="dialog"
      aria-label={`Listing: ${title}`}
      tabIndex={0}
    >
      <div className="flex">
        <div className="relative h-24 w-24 shrink-0 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No photo
            </div>
          )}
        </div>

        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <div className="text-lg font-semibold">${price}</div>
            <div className="flex gap-1">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-0.5 line-clamp-2 text-[15px] font-medium text-gray-900">
            {title}
          </div>

          {address ? (
            <div className="mt-0.5 text-[13px] text-gray-600">{address}</div>
          ) : null}

          <div className="mt-1 flex items-center gap-2 text-[12px] text-gray-500">
            {prettyTime && <span>{prettyTime}</span>}
            {distanceKm != null && (
              <>
                <span aria-hidden>•</span>
                <span>{distanceKm.toFixed(1)} km</span>
              </>
            )}
          </div>

          <div className="mt-2 flex gap-2">
            <button
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              onClick={() => onView?.(id)}
            >
              View
            </button>
            <button
              className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              onClick={() => onDirections?.(id)}
            >
              Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
