import shutil
import subprocess
import sys
from pathlib import Path
import re
import time

from .client import VeaseClient
from .ressources.data import DataResource

LISTENING_PATTERN = re.compile(r"Listening on http://\[?([^\]/:]+|\S+?)\]?:(\d+)")


def _extract_host_port(output: str) -> tuple[str, int]:
    match = LISTENING_PATTERN.search(output)
    if not match:
        raise RuntimeError(
            "Could not find 'Listening on http://...' line in vease output"
        )
    host, port = match.group(1), match.group(2)
    return host, int(port)


def _candidate_names() -> list[str]:
    if sys.platform == "win32":
        return ["vease.exe"]
    return ["vease", "vease_linux.AppImage"]


def _find_vease() -> str:
    veaseExecutable = shutil.which("vease")
    if veaseExecutable is None:
        raise FileNotFoundError(
            "Could not find 'vease' executable on PATH. "
            "Make sure it's installed and PATH is configured correctly."
        )
    return veaseExecutable


def _find_vease_in_folder(folder: str) -> str:
    folder_path = Path(folder)
    if not folder_path.is_dir():
        raise NotADirectoryError(f"'{folder}' is not a valid directory")
    for name in _candidate_names():
        candidate = folder_path / name
        if candidate.is_file():
            return str(candidate)
    raise FileNotFoundError(f"Could not find a 'vease' executable in '{folder}'")


def _run_vease(folder: str | None = None) -> tuple[str, int]:
    veaseExecutable = (
        _find_vease_in_folder(folder) if folder is not None else _find_vease()
    )
    print(f"Running {veaseExecutable}")
    args = [veaseExecutable]
    if veaseExecutable.endswith(".AppImage"):
        args.append("--no-sandbox")
    log_path = Path("vease.log")
    log_file = open(log_path, "w")
    kwargs = {}
    if sys.platform == "win32":
        # Detach fully on Windows: new process group + no console inheritance
        kwargs["creationflags"] = (
            subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP
        )
    else:
        # Detach fully on POSIX: new session, so it's not killed with the parent's group
        kwargs["start_new_session"] = True
    process = subprocess.Popen(
        args,
        stdout=log_file,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        **kwargs,
    )
    log_file.close()
    deadline = time.time() + 60
    host, port = None, None
    while time.time() < deadline:
        if process.poll() is not None:
            raise RuntimeError(
                f"vease exited early (code {process.returncode}); see {log_path}"
            )
        text = log_path.read_text(errors="ignore")
        match = LISTENING_PATTERN.search(text)
        if match:
            host, port = match.group(1), int(match.group(2))
            return host, port
        time.sleep(0.2)
    raise RuntimeError(
        f"vease exited early (code {process.returncode}); see {log_path}"
    )


def createClient(host: str, port: int) -> VeaseClient:
    connect_host = "localhost" if host in ("::", "0.0.0.0", "[::]") else host
    return VeaseClient(f"http://{connect_host}:{port}")


class VeaseScripting:
    def __init__(
        self,
        info: str | None = None,
    ):
        if info is None:
            host, port = _run_vease()
            self.client = createClient(host, port)
        elif info.startswith("http://") or info.startswith("https://"):
            self.client = VeaseClient(info)
        else:
            host, port = _run_vease(info)
            self.client = createClient(host, port)
        self.data = DataResource(self.client)
