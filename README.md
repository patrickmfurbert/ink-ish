# ink-ish

A standalone fork of the Ink renderer used internally by Claude Code, adding
`ScrollBox` (native `overflow: 'scroll'` support) on top of the standard Ink
component API. Built for terminal apps that need a real scrollable chat
history alongside fixed UI chrome — something stock Ink doesn't support.

## Why this exists

Stock Ink re-renders its entire component tree on every state change inside
a fixed-height viewport. There's no way to have part of the screen scroll
naturally while another part (status bar, input bar) stays pinned, without
either clipping content or fighting the renderer.

Claude Code solved this with an internal fork that adds real scroll support
to Ink's DOM and renderer. This package extracts that fork into a
standalone, installable library, with the few Claude-Code-internal
dependencies replaced by no-op stubs or the standard `yoga-layout` npm
package.

## Installation

```bash
npm install github:patrickmfurbert/ink-ish
```

## Usage

Mostly a drop-in replacement for `ink`:

```tsx
import { render, Box, Text, ScrollBox, useApp, useInput } from 'ink-ish';

function App() {
  return (
    <Box flexDirection="column">
      <ScrollBox flexGrow={1} stickyScroll>
        {messages.map(m => <Text key={m.id}>{m.content}</Text>)}
      </ScrollBox>
      <Text>Input goes here</Text>
    </Box>
  );
}

render(<App />);
```

## What's different from stock Ink

- **`ScrollBox`** — new component. Set `overflow: 'scroll'` behavior via
  `stickyScroll` (auto-pins to bottom as content grows) or manual
  `scrollTop` control via the returned `ScrollBoxHandle`.
- **`render()`** is synchronous, matching stock Ink (the underlying fork's
  default export is async; we re-export `renderSync` as `render`).
- **`useStdout`, `useWindowSize`, `usePaste`** are small compatibility
  shims written for this package — the underlying fork doesn't expose
  equivalents with the same shape, so these are minimal reimplementations,
  not passthroughs. They cover common cases but aren't as battle-tested
  as the rest of this package.
- **Layout engine**: uses the standard `yoga-layout` WASM package instead
  of Claude Code's internal synchronous TypeScript Yoga port. This adds
  one async load step at module import time (handled internally via
  top-level await) but otherwise behaves identically.

## What's NOT included

Anything specific to Claude Code's own application — their devtools
integration, search highlighting UI, terminal notification system, etc.
are present in the source but unused/unexported here. Only the rendering
core and the components/hooks codemonkeycli needs are wired up in
`index.ts`. Feel free to export more from the underlying files as needed.

## License

MIT, same as upstream Ink. This package is derived from Vadim Demedes'
[Ink](https://github.com/vadimdemedes/ink) via Anthropic's internal fork
used in Claude Code.
