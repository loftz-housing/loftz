# Migrates LOFTZ room photos: Drive -> downscale (web) -> Supabase Storage.
# Preserves display order (folder + filename natural order). Resumable via
# photo_progress.json. Writes uploaded_photos.json for load-photos.mjs.
#
# Usage: python scripts/migrate_photos.py [--limit N]
import io, json, os, re, sys
import requests
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from PIL import Image, ImageOps

HERE = os.path.dirname(__file__)
SA_KEY = r"C:\Users\santa\.claude\secrets\loftz-drive-sa.json"
SUPA_SECRETS = os.path.join(os.path.expanduser("~"), ".claude", "secrets", "supabase.txt")

APARTMENTS = "1y8NAu6MSRmLuq63ZrdXc6lgQf-znvUt3"
BUCKET = "room-photos"
MAX_DIM = 1600
JPEG_Q = 82

CODE_MAP = {  # Drive label -> (residence_code, residence_slug); ET1/ET2 skipped
    "MS61": ("MS61", "ms-61"), "MS56": ("MS56", "ms-56"),
    "MA 1": ("MA1", "ma-1"), "MA 3": ("MA3", "ma-3"), "MA 5": ("MA5", "ma-5"),
    "CA": ("CA", "ca"), "GF": ("GF", "gf"), "AO": ("AO", "ao"),
}

def supa_env():
    url = key = None
    with open(SUPA_SECRETS, encoding="utf-8") as f:
        for line in f:
            if line.startswith("SUPABASE_URL="): url = line.split("=", 1)[1].strip()
            if line.startswith("SUPABASE_PUBLISHABLE_KEY="): key = line.split("=", 1)[1].strip()
    return url, key

SUPA_URL, SUPA_KEY = supa_env()
creds = service_account.Credentials.from_service_account_file(
    SA_KEY, scopes=["https://www.googleapis.com/auth/drive.readonly"])
drive = build("drive", "v3", credentials=creds)

def kids(pid):
    out, page = [], None
    while True:
        r = drive.files().list(
            q=f"'{pid}' in parents and trashed=false",
            fields="nextPageToken,files(id,name,mimeType)",
            pageSize=1000, pageToken=page,
            includeItemsFromAllDrives=True, supportsAllDrives=True,
            orderBy="name").execute()
        out += r.get("files", []); page = r.get("nextPageToken")
        if not page: break
    return out

def is_folder(f): return f["mimeType"].endswith(".folder")
def is_image(f): return f["mimeType"].startswith("image/")
def natkey(n):
    m = re.match(r"\s*(\d+)", n); return (int(m.group(1)) if m else 9999, n.lower())

def classify(name):
    n = name.lower()
    if "common" in n: return ("common", None)
    if "other" in n: return ("other", None)
    m = re.search(r"room\s*(\d+)", n)
    if m: return ("room", int(m.group(1)))
    return (None, None)

def collect_groups(folder_id, acc):
    """Recursively find Room/Common/Other folders; keep first per key."""
    for g in sorted([x for x in kids(folder_id) if is_folder(x)], key=lambda x: natkey(x["name"])):
        cat, room = classify(g["name"])
        if cat:
            key = (cat, room)
            if key not in acc:
                acc[key] = g["id"]
        else:
            collect_groups(g["id"], acc)  # descend (Photos / photographer folders)

def build_manifest():
    manifest = []
    for f in kids(APARTMENTS):
        if not is_folder(f) or "LOFTZ" not in f["name"]:
            continue
        label = f["name"].split("|")[-1].strip()
        if label not in CODE_MAP:
            continue
        code, slug = CODE_MAP[label]
        groups = {}
        collect_groups(f["id"], groups)
        for (cat, room), gid in groups.items():
            imgs = sorted([i for i in kids(gid) if is_image(i)], key=lambda i: natkey(i["name"]))
            for order, img in enumerate(imgs):
                manifest.append({
                    "residence_code": code, "residence_slug": slug,
                    "category": cat, "room_no": room,
                    "file_id": img["id"], "order": order,
                })
    return manifest

def download_bytes(file_id):
    req = drive.files().get_media(fileId=file_id)
    buf = io.BytesIO()
    dl = MediaIoBaseDownload(buf, req)
    done = False
    while not done:
        _, done = dl.next_chunk()
    buf.seek(0)
    return buf

def downscale(buf):
    img = Image.open(buf)
    img = ImageOps.exif_transpose(img)
    if img.mode != "RGB":
        img = img.convert("RGB")
    img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=JPEG_Q, optimize=True)
    return out.getvalue()

def storage_path(m):
    sub = "common" if m["category"] == "common" else (
        "other" if m["category"] == "other" else f"room-{m['room_no']}")
    return f"{m['residence_slug']}/{sub}/{m['order']:02d}.jpg"

def upload(path, data):
    url = f"{SUPA_URL}/storage/v1/object/{BUCKET}/{path}"
    r = requests.post(url, data=data, headers={
        "apikey": SUPA_KEY,
        "Authorization": f"Bearer {SUPA_KEY}",
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
    }, timeout=60)
    return r

def public_url(path):
    return f"{SUPA_URL}/storage/v1/object/public/{BUCKET}/{path}"

def main():
    limit = None
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])

    manifest = build_manifest()
    print(f"Manifest: {len(manifest)} photos")

    prog_path = os.path.join(HERE, "photo_progress.json")
    progress = {}
    if os.path.exists(prog_path):
        progress = json.load(open(prog_path, encoding="utf-8"))

    uploaded = []
    done = 0
    for m in manifest:
        path = storage_path(m)
        row = {**{k: m[k] for k in ("residence_code", "residence_slug", "category", "room_no", "order")},
               "storage_path": path, "url": public_url(path)}
        if m["file_id"] in progress:
            uploaded.append(row); continue
        try:
            data = downscale(download_bytes(m["file_id"]))
            r = upload(path, data)
            if r.status_code not in (200, 201):
                print(f"  UPLOAD FAIL {path}: {r.status_code} {r.text[:120]}")
                if r.status_code in (401, 403):
                    print("AUTH ERROR — stopping."); break
                continue
            progress[m["file_id"]] = path
            uploaded.append(row)
            done += 1
            if done % 20 == 0:
                json.dump(progress, open(prog_path, "w"))
                print(f"  {done} uploaded…")
        except Exception as e:
            print(f"  ERROR {path}: {e}")
        if limit and done >= limit:
            print(f"Reached --limit {limit}"); break

    json.dump(progress, open(prog_path, "w"))
    json.dump(uploaded, open(os.path.join(HERE, "uploaded_photos.json"), "w"))
    print(f"Done. Uploaded this run: {done}. Total known: {len(uploaded)}.")

if __name__ == "__main__":
    main()
