import Image from "next/image";
import { query } from "@/lib/admin-db";
import { movePhoto, setCoverPhoto, removePhoto } from "../../actions";

export const dynamic = "force-dynamic";

interface RoomOpt {
  id: string;
  name: string;
  residence: string;
  photo_count: string;
}
interface PhotoRow {
  id: string;
  url: string;
  sort_index: number;
}

const STORAGE_UPLOAD_ENABLED = !!process.env.SUPABASE_SERVICE_KEY;

export default async function AdminPhotos({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room: roomId } = await searchParams;

  const rooms = await query<RoomOpt>(
    `select rm.id, rm.name, res.name as residence,
            (select count(*) from photos p where p.room_id = rm.id) as photo_count
     from rooms rm join residences res on res.id = rm.residence_id
     order by res.name, rm.sort_index`
  );

  let room: { id: string; name: string; residence: string } | null = null;
  let photos: PhotoRow[] = [];
  if (roomId) {
    [room] = await query<{ id: string; name: string; residence: string }>(
      `select rm.id, rm.name, res.name as residence
       from rooms rm join residences res on res.id = rm.residence_id
       where rm.id = $1`,
      [roomId]
    );
    photos = await query<PhotoRow>(
      `select id, url, sort_index from photos
       where room_id = $1 order by sort_index, created_at`,
      [roomId]
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Photos</h1>
      <p className="prose-muted mt-2 text-sm">
        Reorder a room&apos;s photos (the first one is the cover shown on cards and
        social previews) or remove one.
      </p>

      {/* Room picker */}
      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="label" htmlFor="room">
            Room
          </label>
          <select
            id="room"
            name="room"
            defaultValue={roomId ?? ""}
            className="field w-auto"
          >
            <option value="" disabled>
              Choose a room…
            </option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.residence} · {r.name} ({r.photo_count})
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-outline">Load</button>
      </form>

      {!STORAGE_UPLOAD_ENABLED && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-3 text-xs text-ink-soft">
          Uploading new photos needs the Supabase service key (env
          <code className="mx-1">SUPABASE_SERVICE_KEY</code>; see NEXT.md follow-up
          #6). Reordering, setting a cover and removing work now.
        </div>
      )}

      {room && (
        <div className="mt-8">
          <h2 className="text-lg font-medium">
            {room.residence} · {room.name}
          </h2>
          {photos.length === 0 ? (
            <p className="prose-muted mt-3 text-sm">
              This room has no photos yet.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((p, i) => (
                <div key={p.id} className="card overflow-hidden">
                  <div className="relative aspect-[4/3] bg-surface-2">
                    <Image
                      src={p.url}
                      alt=""
                      fill
                      sizes="(max-width:640px) 100vw, 320px"
                      className="object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 chip chip-accent">
                        Cover
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 p-2">
                    <MoveButton id={p.id} roomId={room.id} dir="up" disabled={i === 0} label="↑" />
                    <MoveButton
                      id={p.id}
                      roomId={room.id}
                      dir="down"
                      disabled={i === photos.length - 1}
                      label="↓"
                    />
                    {i !== 0 && (
                      <form action={setCoverPhoto}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="room_id" value={room.id} />
                        <button className="btn btn-ghost px-2 py-1 text-xs">
                          Set cover
                        </button>
                      </form>
                    )}
                    <form action={removePhoto} className="ml-auto">
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="room_id" value={room.id} />
                      <button className="btn btn-ghost px-2 py-1 text-xs text-[var(--color-danger)]">
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MoveButton({
  id,
  roomId,
  dir,
  disabled,
  label,
}: {
  id: string;
  roomId: string;
  dir: "up" | "down";
  disabled: boolean;
  label: string;
}) {
  return (
    <form action={movePhoto}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="room_id" value={roomId} />
      <input type="hidden" name="dir" value={dir} />
      <button
        className="btn btn-outline px-2 py-1 text-xs disabled:opacity-40"
        disabled={disabled}
        aria-label={dir === "up" ? "Move earlier" : "Move later"}
      >
        {label}
      </button>
    </form>
  );
}
