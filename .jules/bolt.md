## 2024-02-04 - Memoize Expensive Array Filtering
**Learning:** `UtilsService.filterList` creates a new array reference and performs $O(N)$ filtering. Using it directly in template bindings (via methods or getters) defeats `OnPush` change detection optimizations in child components because the array reference changes on every check, even if data hasn't changed.
**Action:** Use `computed` signals to derive and memoize filtered lists. This ensures stable array references are passed to child components, preventing unnecessary re-renders.
