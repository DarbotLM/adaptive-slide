/**
 * Path-based mutation helpers for editing AdaptiveDeck tiles.
 *
 * A path is an array of indexes into nested `items` arrays:
 *   []             → the slide itself (not a tile)
 *   [2]            → slide.body[2]
 *   [2, 0]         → slide.body[2].items[0]
 *   [2, 0, 1]      → slide.body[2].items[0].items[1]
 *
 * All helpers return a new top-level slide object. They never mutate inputs.
 */

function cloneTile(tile) {
  return JSON.parse(JSON.stringify(tile));
}

export function cloneDeck(deck) {
  return JSON.parse(JSON.stringify(deck));
}

export function getTileAtPath(slide, path) {
  if (!slide || !path || path.length === 0) return null;
  let current = slide.body;
  let tile = null;
  for (let i = 0; i < path.length; i++) {
    if (!Array.isArray(current)) return null;
    tile = current[path[i]];
    if (!tile) return null;
    current = tile.items;
  }
  return tile;
}

function setItemsAtPath(slide, parentPath, newItems) {
  const next = cloneTile(slide);
  if (parentPath.length === 0) {
    next.body = newItems;
    return next;
  }
  let cursor = next.body;
  for (let i = 0; i < parentPath.length - 1; i++) {
    cursor = cursor[parentPath[i]].items;
  }
  cursor[parentPath[parentPath.length - 1]].items = newItems;
  return next;
}

function getItemsAtParent(slide, parentPath) {
  if (parentPath.length === 0) return slide.body ?? [];
  let cursor = slide.body;
  for (let i = 0; i < parentPath.length - 1; i++) {
    cursor = cursor[parentPath[i]].items;
  }
  return cursor[parentPath[parentPath.length - 1]].items ?? [];
}

export function updateTileAtPath(slide, path, updater) {
  if (!path || path.length === 0) return slide;
  const next = cloneTile(slide);
  let cursor = next.body;
  for (let i = 0; i < path.length - 1; i++) {
    cursor = cursor[path[i]].items;
  }
  const idx = path[path.length - 1];
  cursor[idx] = updater(cursor[idx]);
  return next;
}

export function removeTileAtPath(slide, path) {
  if (!path || path.length === 0) return slide;
  const parentPath = path.slice(0, -1);
  const items = [...getItemsAtParent(slide, parentPath)];
  items.splice(path[path.length - 1], 1);
  return setItemsAtPath(slide, parentPath, items);
}

export function moveTileAtPath(slide, path, delta) {
  if (!path || path.length === 0) return slide;
  const parentPath = path.slice(0, -1);
  const items = [...getItemsAtParent(slide, parentPath)];
  const idx = path[path.length - 1];
  const target = idx + delta;
  if (target < 0 || target >= items.length) return slide;
  const [moved] = items.splice(idx, 1);
  items.splice(target, 0, moved);
  return setItemsAtPath(slide, parentPath, items);
}

export function addTileAtParent(slide, parentPath, tile) {
  const items = [...getItemsAtParent(slide, parentPath), tile];
  return setItemsAtPath(slide, parentPath, items);
}

/**
 * Replace one slide in a deck. Returns a new deck.
 */
export function replaceSlide(deck, slideIndex, newSlide) {
  const next = cloneDeck(deck);
  next.slides[slideIndex] = newSlide;
  return next;
}

/**
 * Convenience: deck-level updater that operates on a single slide path.
 */
export function updateSlide(deck, slideIndex, updater) {
  const next = cloneDeck(deck);
  next.slides[slideIndex] = updater(next.slides[slideIndex]);
  return next;
}

/**
 * Returns true if `pathA` and `pathB` reference the same tile.
 */
export function samePath(pathA, pathB) {
  if (!pathA || !pathB) return pathA === pathB;
  if (pathA.length !== pathB.length) return false;
  for (let i = 0; i < pathA.length; i++) {
    if (pathA[i] !== pathB[i]) return false;
  }
  return true;
}

/**
 * Path remap after a delete/move at `mutatedPath`. Returns the adjusted
 * `selectedPath` or null if it should be cleared.
 */
export function remapAfterDelete(selectedPath, deletedPath) {
  if (!selectedPath || !deletedPath) return selectedPath;
  // Selected is the deleted tile or any descendant — clear.
  if (
    selectedPath.length >= deletedPath.length &&
    deletedPath.every((v, i) => selectedPath[i] === v)
  ) {
    return null;
  }
  // Selected is a sibling at the same parent with a higher index — shift down.
  const parentLen = deletedPath.length - 1;
  if (
    selectedPath.length >= deletedPath.length &&
    selectedPath.slice(0, parentLen).every((v, i) => v === deletedPath[i]) &&
    selectedPath[parentLen] > deletedPath[parentLen]
  ) {
    const next = [...selectedPath];
    next[parentLen] -= 1;
    return next;
  }
  return selectedPath;
}

export function remapAfterMove(selectedPath, fromPath, delta) {
  if (!selectedPath || !fromPath) return selectedPath;
  const parentLen = fromPath.length - 1;
  if (selectedPath.length < fromPath.length) return selectedPath;
  if (!selectedPath.slice(0, parentLen).every((v, i) => v === fromPath[i])) {
    return selectedPath;
  }
  const fromIdx = fromPath[parentLen];
  const toIdx = fromIdx + delta;
  const selIdx = selectedPath[parentLen];
  let newIdx = selIdx;
  if (selIdx === fromIdx) newIdx = toIdx;
  else if (delta > 0 && selIdx > fromIdx && selIdx <= toIdx) newIdx = selIdx - 1;
  else if (delta < 0 && selIdx < fromIdx && selIdx >= toIdx) newIdx = selIdx + 1;
  if (newIdx === selIdx) return selectedPath;
  const next = [...selectedPath];
  next[parentLen] = newIdx;
  return next;
}
