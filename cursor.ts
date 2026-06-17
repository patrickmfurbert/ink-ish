/**
 * Terminal cursor position and visibility, as tracked per-frame by the
 * renderer. Not to be confused with Claude Code's separate text-editing
 * Cursor class (kill ring, emacs-style line editing) — that's a different
 * concept that lived in their utils/Cursor.ts and isn't part of ink-ish.
 */
export type Cursor = {
  x: number
  y: number
  visible: boolean
}
