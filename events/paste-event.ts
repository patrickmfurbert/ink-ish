import { TerminalEvent } from './terminal-event.js'

/**
 * Paste event. Not constructed anywhere in ink-ish today — the onPaste
 * prop type in event-handlers.ts references this, but codemonkeycli's
 * usePaste() (in index.ts) is a standalone implementation that doesn't
 * route through this event system. Kept as a type-only stand-in so
 * event-handlers.ts resolves.
 */
export class PasteEvent extends TerminalEvent {
  readonly text: string

  constructor(text: string) {
    super('paste', { bubbles: true, cancelable: false })
    this.text = text
  }
}
