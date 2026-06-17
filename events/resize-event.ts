import { TerminalEvent } from './terminal-event.js'

/**
 * Resize event. Not constructed anywhere in ink-ish today — the onResize
 * prop type in event-handlers.ts references this, but codemonkeycli's
 * useWindowSize() (in index.ts) is a standalone implementation that
 * doesn't route through this event system. Kept as a type-only stand-in
 * so event-handlers.ts resolves.
 */
export class ResizeEvent extends TerminalEvent {
  readonly columns: number
  readonly rows: number

  constructor(columns: number, rows: number) {
    super('resize', { bubbles: false, cancelable: false })
    this.columns = columns
    this.rows = rows
  }
}
