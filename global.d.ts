// Placeholder for the original Claude Code global.d.ts, which wasn't
// included in the source export this package was built from. The original
// likely declared ambient JSX intrinsic types for ink-box/ink-text/etc, but
// those custom elements are only ever produced internally by the custom
// React reconciler (reconciler.ts) — application code never writes
// `<ink-box>` JSX directly, only `<Box>`/`<Text>` component JSX, which
// already has proper types via Box.tsx/Text.tsx. This file exists purely
// so the side-effect imports in Box.tsx and ScrollBox.tsx resolve.
export {};

// supports-hyperlinks has no published @types package either.
declare module 'supports-hyperlinks' {
  const supportsHyperlinks: {
    stdout: boolean;
    stderr: boolean;
  };
  export default supportsHyperlinks;
}

// stringWidth.ts and wrapAnsi.ts both opportunistically use Bun's native
// stringWidth/wrapAnsi when running under Bun (faster than the JS
// fallback), guarded by `typeof Bun !== 'undefined'` checks. Since
// codemonkeycli runs on Node, not Bun, that branch is always skipped at
// runtime — this declaration just lets TypeScript typecheck the guard
// itself without pulling in the full @types/bun package. Wrapped in
// `declare global` since the `export {}` above makes this file
// module-scoped (same issue we hit with the JSX augmentation below).
declare global {
  const Bun:
    | {
        stringWidth?: (input: string, options?: Record<string, unknown>) => number;
        wrapAnsi?: (input: string, columns: number, options?: Record<string, unknown>) => string;
      }
    | undefined;
}

// React 19 ships react/compiler-runtime as a real JS module (used by code
// that's been processed by the React Compiler/Babel plugin, which these
// fork files were), but doesn't publish a .d.ts for it. `c(size)` is a
// per-component memoization cache, conceptually like useMemoCache.
declare module 'react/compiler-runtime' {
  export function c(size: number): unknown[]
}

// The custom reconciler (reconciler.ts) targets these host element names
// directly (see dom.ts's ElementNames type) rather than going through
// React DOM. A few files construct them via raw JSX (e.g. Box.tsx renders
// <ink-box>, Text.tsx renders <ink-text>) rather than only ever producing
// them programmatically, so JSX needs to know these are valid intrinsics.
//
// Where TypeScript looks for IntrinsicElements depends on the consuming
// project's "jsx" tsconfig setting, not just this package's own setting:
//   - "jsx": "react-jsx" (new transform) → global React.JSX namespace
//   - "jsx": "react" (classic transform) → bare global JSX namespace
// Since ink-ish is a published dependency, we can't assume which mode a
// consumer uses (codemonkeycli itself uses classic "react", for instance),
// so both are declared here to cover either case.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ink-root': Record<string, unknown>
      'ink-box': Record<string, unknown>
      'ink-text': Record<string, unknown>
      'ink-virtual-text': Record<string, unknown>
      'ink-link': Record<string, unknown>
      'ink-progress': Record<string, unknown>
      'ink-raw-ansi': Record<string, unknown>
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'ink-root': Record<string, unknown>
        'ink-box': Record<string, unknown>
        'ink-text': Record<string, unknown>
        'ink-virtual-text': Record<string, unknown>
        'ink-link': Record<string, unknown>
        'ink-progress': Record<string, unknown>
        'ink-raw-ansi': Record<string, unknown>
      }
    }
  }
}
