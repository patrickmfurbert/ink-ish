/// <reference path="./global.d.ts" />

// ink-ish — a fork of Claude Code's internal Ink fork, packaged as a
// standalone library. Adds ScrollBox (overflow: 'scroll') support on top
// of the standard Ink component API.
//
// Most exports below are direct passthroughs from the fork. A few
// (useStdout, usePaste, useWindowSize) are small compatibility shims
// written here because the fork handles those concerns differently
// internally and didn't export equivalent public hooks.

import { useEffect, useState } from 'react'

// NOTE: the fork's default export (`wrappedRender`) is async — it awaits
// a microtask boundary before mounting. We export `renderSync` as `render`
// instead so call sites written against stock Ink's synchronous render()
// keep working without an `await`.
export { renderSync as render } from './root.js'
export type { RenderOptions, Instance } from './root.js'

export { default as Box } from './components/Box.js'
export type { Props as BoxProps } from './components/Box.js'

export { default as Text } from './components/Text.js'
export type { Props as TextProps } from './components/Text.js'

export { default as Newline } from './components/Newline.js'
export { default as Spacer } from './components/Spacer.js'

export { default as ScrollBox } from './components/ScrollBox.js'
export type { ScrollBoxHandle, ScrollBoxProps } from './components/ScrollBox.js'

export { default as useApp } from './hooks/use-app.js'
export { default as useInput } from './hooks/use-input.js'
export type { Key } from './events/input-event.js'
export { default as useStdin } from './hooks/use-stdin.js'

export { default as measureElement } from './measure-element.js'
export type { DOMElement } from './dom.js'

// -- Compatibility shims --------------------------------------------------

/**
 * Drop-in replacement for Ink's useStdout(). The fork doesn't export an
 * equivalent hook, so this wraps process.stdout directly. Writing here
 * goes straight to the terminal's natural scroll buffer, same as stock Ink.
 */
export function useStdout() {
  return {
    stdout: process.stdout,
    write: (data: string) => process.stdout.write(data),
  }
}

/**
 * Drop-in replacement for Ink's useWindowSize(). Tracks process.stdout's
 * columns/rows and re-renders on terminal resize.
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    columns: process.stdout.columns ?? 80,
    rows: process.stdout.rows ?? 24,
  })

  useEffect(() => {
    const onResize = () => {
      setSize({
        columns: process.stdout.columns ?? 80,
        rows: process.stdout.rows ?? 24,
      })
    }
    process.stdout.on('resize', onResize)
    return () => {
      process.stdout.off('resize', onResize)
    }
  }, [])

  return size
}

/**
 * Drop-in replacement for Ink's usePaste(). Listens for bracketed-paste
 * sequences on stdin and calls onPaste with the pasted text. This is a
 * minimal implementation — it does not handle every edge case stock Ink's
 * usePaste covers, but matches the subset codemonkeycli's InputBar relies on.
 */
export function usePaste(onPaste: (text: string) => void) {
  useEffect(() => {
    const PASTE_START = '\x1b[200~'
    const PASTE_END = '\x1b[201~'
    let buffering = false
    let buffer = ''

    const onData = (chunk: Buffer) => {
      const str = chunk.toString('utf8')
      if (!buffering && str.includes(PASTE_START)) {
        buffering = true
        buffer = str.slice(str.indexOf(PASTE_START) + PASTE_START.length)
        if (buffer.includes(PASTE_END)) {
          onPaste(buffer.slice(0, buffer.indexOf(PASTE_END)))
          buffering = false
          buffer = ''
        }
        return
      }
      if (buffering) {
        buffer += str
        if (buffer.includes(PASTE_END)) {
          onPaste(buffer.slice(0, buffer.indexOf(PASTE_END)))
          buffering = false
          buffer = ''
        }
      }
    }

    process.stdin.on('data', onData)
    return () => {
      process.stdin.off('data', onData)
    }
  }, [onPaste])
}
