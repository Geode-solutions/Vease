# Vendored llama.cpp

Pinned release: [`b10809`](https://github.com/ggml-org/llama.cpp/releases/tag/b10809)

- `llama-b10809-bin-ubuntu-x64.zip` — repackaging of
  `llama-b10809-bin-ubuntu-x64.tar.gz` from the release (re-zipped so both
  platforms can share the same extraction code path)
- `llama-b10809-bin-win-x64.zip` — `llama-b10809-bin-win-cpu-x64.zip` from the
  release, unmodified

Each archive holds the `llama`/`llama.exe` executable alongside every shared
library it links against (per-CPU backend variants included, plus every
subcommand's `*-impl` library — `llama` hard-links all of them even though
Vease only ever runs `llama serve`, verified with `readelf -d`/`objdump -p`).
The handful of _other_ standalone CLI tools the release ships
(`llama-cli`, `llama-quantize`, `llama-tts`, etc.) were removed since nothing
in Vease invokes them and they're separate executables, not shared
dependencies.

`server/utils/llama_cpp.js` extracts the right archive to a local cache
directory on first run and reuses it afterwards — nothing here is extracted
ahead of time.

To upgrade, download the two assets for a newer release tag, remove the same
set of redundant standalone tools, re-zip, and replace these two files.

Licensed under MIT — see `LICENSE`.
