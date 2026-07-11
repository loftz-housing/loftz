# Enumerates the LOFTZ Drive photo tree and writes a manifest for migration.
# Structure: 2.Apartments / "<n>. LOFTZ | <CODE>" / "1. Photos" /
#   ("0. Common Areas" | "<n>. Room N" | "7. Others") / <ordered image files>
import json, re, sys, os
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY = r"C:\Users\santa\.claude\secrets\loftz-drive-sa.json"
creds = service_account.Credentials.from_service_account_file(
    KEY, scopes=["https://www.googleapis.com/auth/drive.readonly"])
drive = build("drive", "v3", credentials=creds)

APARTMENTS = "1y8NAu6MSRmLuq63ZrdXc6lgQf-znvUt3"

# Drive folder label (after "LOFTZ | ") -> DB residence code. ET1/ET2 unclear
# (no MA2 folder) -> skipped to avoid mis-assigning photos (noted in NEXT.md).
CODE_MAP = {
    "MS61": "MS61", "MS56": "MS56", "MA 1": "MA1", "MA 3": "MA3",
    "MA 5": "MA5", "CA": "CA", "GF": "GF", "AO": "AO",
}

def kids(pid):
    out, page = [], None
    while True:
        r = drive.files().list(
            q=f"'{pid}' in parents and trashed=false",
            fields="nextPageToken,files(id,name,mimeType,size)",
            pageSize=1000, pageToken=page,
            includeItemsFromAllDrives=True, supportsAllDrives=True,
            orderBy="name").execute()
        out += r.get("files", []); page = r.get("nextPageToken")
        if not page: break
    return out

def is_folder(f): return f["mimeType"].endswith(".folder")
def is_image(f): return f["mimeType"].startswith("image/")

def natkey(name):
    m = re.match(r"\s*(\d+)", name)
    return (int(m.group(1)) if m else 9999, name.lower())

manifest = []
total_bytes = 0
top = kids(APARTMENTS)
for f in top:
    if not is_folder(f) or "LOFTZ" not in f["name"]:
        continue
    label = f["name"].split("|")[-1].strip()
    code = CODE_MAP.get(label)
    if not code:
        print(f"SKIP residence folder '{f['name']}' (no mapping)")
        continue
    # find the "Photos" subfolder
    subs = kids(f["id"])
    photos_folder = next((s for s in subs if is_folder(s) and "photo" in s["name"].lower()), None)
    if not photos_folder:
        print(f"  {code}: no Photos folder")
        continue
    groups = sorted([g for g in kids(photos_folder["id"]) if is_folder(g)], key=lambda g: natkey(g["name"]))
    for g in groups:
        gname = g["name"].lower()
        if "common" in gname:
            category, room_no = "common", None
        elif "other" in gname:
            category, room_no = "other", None
        else:
            m = re.search(r"room\s*(\d+)", gname)
            if not m:
                continue  # skip unknown subfolders
            category, room_no = "room", int(m.group(1))
        imgs = sorted([i for i in kids(g["id"]) if is_image(i)], key=lambda i: natkey(i["name"]))
        for order, img in enumerate(imgs):
            sz = int(img.get("size", 0))
            total_bytes += sz
            manifest.append({
                "residence_code": code, "category": category, "room_no": room_no,
                "file_id": img["id"], "name": img["name"], "size": sz, "order": order,
            })

by_res = {}
for m in manifest:
    by_res.setdefault(m["residence_code"], 0)
    by_res[m["residence_code"]] += 1

print("\n=== PHOTO PLAN ===")
for code, n in sorted(by_res.items()):
    print(f"  {code}: {n} photos")
print(f"TOTAL: {len(manifest)} photos, {total_bytes/1024/1024:.1f} MB")

out_path = os.path.join(os.path.dirname(__file__), "photo_manifest.json")
with open(out_path, "w", encoding="utf-8") as fh:
    json.dump(manifest, fh)
print("Manifest ->", out_path)
