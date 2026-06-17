// Stub implementations of internal Claude Code utilities that the
// upstream ink fork depended on. Most are logging/metrics hooks that are
// safe no-ops outside of Claude Code's own codebase. A couple
// (isEnvTruthy, getGraphemeSegmenter) are tiny real reimplementations
// since they're cheap to do correctly rather than stub out.

import { execFile } from 'node:child_process';

// -- bootstrap/state.js stand-ins -----------------------------------------

export const markScrollActivity = (..._args: unknown[]): void => {};
export const flushInteractionTime = (..._args: unknown[]): void => {};
export const updateLastInteractionTime = (..._args: unknown[]): void => {};

// -- utils/debug.js + utils/log.js stand-ins ------------------------------

export const logForDebugging = (..._args: unknown[]): void => {};
export const logError = (..._args: unknown[]): void => {};

// -- utils/earlyInput.js stand-in -----------------------------------------
// Claude Code buffers input typed before the REPL mounts and replays it.
// codemonkeycli's startup is fast enough that this isn't needed; no-op.

export const stopCapturingEarlyInput = (..._args: unknown[]): void => {};

// -- utils/envUtils.js stand-in -------------------------------------------
// Real reimplementation: checks whether an env var is set to a truthy
// string ('1', 'true', 'yes'), same convention Claude Code's original used.

export function isEnvTruthy(value: string | undefined): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes'].includes(value.toLowerCase());
}

// -- utils/fullscreen.js stand-in -----------------------------------------
// Always allow mouse clicks; codemonkeycli has no setting to disable them.

export const isMouseClicksDisabled = (): boolean => false;

// -- utils/native-ts yoga counters stand-in --------------------------------

export const getYogaCounters = (): {
  visited: number;
  measured: number;
  cacheHits: number;
  live: number;
} => ({ visited: 0, measured: 0, cacheHits: 0, live: 0 });

// -- utils/env.js stand-in -------------------------------------------------
// Original wraps process.env with extra validation; a direct passthrough
// is fine here since codemonkeycli doesn't rely on that validation layer.

export const env = process.env;

// -- utils/execFileNoThrow.js stand-in -------------------------------------
// Used only by OSC clipboard integration (tmux/pbcopy/wl-copy/xclip/xsel),
// which codemonkeycli's TUI doesn't expose. Reimplemented properly anyway
// since it's cheap and keeps the clipboard code path functional if anyone
// wires it up later.

export type ExecFileNoThrowOptions = {
  input?: string;
  useCwd?: boolean;
  timeout?: number;
};

export function execFileNoThrow(
  file: string,
  args: string[] = [],
  options: ExecFileNoThrowOptions = {}
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile(
      file,
      args,
      { cwd: options.useCwd === false ? undefined : process.cwd(), timeout: options.timeout },
      (error, stdout, stderr) => {
        resolve({
          code: error && 'code' in error && typeof error.code === 'number' ? error.code : error ? 1 : 0,
          stdout: stdout?.toString() ?? '',
          stderr: stderr?.toString() ?? '',
        });
      }
    );
    if (options.input && child.stdin) {
      child.stdin.write(options.input);
      child.stdin.end();
    }
  });
}

// -- utils/intl.js stand-in -------------------------------------------------
// Real reimplementation using Node's built-in Intl.Segmenter (available in
// Node 16+), which is what Claude Code's original almost certainly wrapped.

let cachedSegmenter: Intl.Segmenter | undefined;

export function getGraphemeSegmenter(): Intl.Segmenter {
  if (!cachedSegmenter) {
    cachedSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  }
  return cachedSegmenter;
}

// -- utils/sliceAnsi.js stand-in --------------------------------------------
// Direct passthrough to the slice-ansi npm package, which has the identical
// (text, start, end) signature the original almost certainly wrapped.

export { default as sliceAnsi } from 'slice-ansi';

// -- utils/semver.js stand-in -------------------------------------------------
// Direct passthrough to the semver npm package (already a dependency).

export { gte } from 'semver';

