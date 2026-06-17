// Original devtools.js (react-devtools-core integration) wasn't included
// in the source export this package was built from. It's only ever
// dynamically imported behind a DEV-only conditional in reconciler.ts, so
// a no-op stub here just means devtools connection silently does nothing
// rather than failing to resolve.
export default function connectToDevtools(): void {}
