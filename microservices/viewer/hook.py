import os
import sys

# For --onefile (extracted to temp _MEI folder)
if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
    bundle_dir = sys._MEIPASS
else:
    # For --onedir bundle (easier to debug first)
    bundle_dir = os.path.dirname(sys.executable)
    bundle_dir = os.path.join(bundle_dir, "_internal")

dri_path = os.path.join(bundle_dir, "dri")
if os.path.exists(dri_path):
    os.environ["LIBGL_DRIVERS_PATH"] = dri_path
    print(f"Set LIBGL_DRIVERS_PATH to {dri_path}")
