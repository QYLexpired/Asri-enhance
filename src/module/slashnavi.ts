type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
type Nullable<T> = T | null;
interface CenterPoint {
  el: HTMLElement;
  x: number;
  y: number;
}
let isSessionActive = false;
let pollTimerId: Nullable<number> = null;
let pollAttempts = 0;
let activeMenuElement: Nullable<HTMLElement> = null;
let menuAttrObserver: Nullable<MutationObserver> = null;
let domObserver: Nullable<MutationObserver> = null;
let keydownHandler: ((evt: KeyboardEvent) => void) | null = null;
function findHintMenu(): Nullable<HTMLElement> {
  return document.querySelector('.protyle-hint.hint--menu:not(.fn__none)');
}
function endSession(): void {
  isSessionActive = false;
  activeMenuElement = null;
  if (pollTimerId !== null) {
    clearInterval(pollTimerId);
    pollTimerId = null;
  }
  if (menuAttrObserver) {
    try { menuAttrObserver.disconnect(); } catch {}
    menuAttrObserver = null;
  }
  if (domObserver) {
    try { domObserver.disconnect(); } catch {}
    domObserver = null;
  }
}
function isMenuVisible(el: Nullable<HTMLElement>): boolean {
  return !!(el && document.body.contains(el) && !el.classList.contains('fn__none'));
}
function attachObserversForActiveMenu(): void {
  if (!activeMenuElement) return;
  if (!menuAttrObserver) {
    menuAttrObserver = new MutationObserver(() => {
      if (!isMenuVisible(activeMenuElement)) {
        endSession();
      }
    });
    try {
      menuAttrObserver.observe(activeMenuElement, { attributes: true, attributeFilter: ['class', 'style'] });
    } catch {}
  }
  if (!domObserver) {
    domObserver = new MutationObserver(() => {
      if (!isMenuVisible(activeMenuElement)) {
        endSession();
      }
    });
    try {
      domObserver.observe(document.body, { childList: true, subtree: true });
    } catch {}
  }
}
function beginPollingForMenu(): boolean {
  const found = findHintMenu();
  if (found) {
    activeMenuElement = found;
    attachObserversForActiveMenu();
    return true;
  }
  pollAttempts = 0;
  pollTimerId = setInterval(() => {
    pollAttempts += 1;
    const el = findHintMenu();
    if (el) {
      activeMenuElement = el;
      clearInterval(pollTimerId);
      pollTimerId = null;
      attachObserversForActiveMenu();
    } else if (pollAttempts >= 10) {
      clearInterval(pollTimerId);
      pollTimerId = null;
      endSession();
    }
  }, 100);
  return false;
}
function getListItems(container: HTMLElement): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>('.b3-list-item'));
}
function getFocusedItem(container: HTMLElement): Nullable<HTMLElement> {
  if (!container) return null;
  return container.querySelector('.b3-list-item--focus');
}
function getItemCenters(items: HTMLElement[]): CenterPoint[] {
  return items.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      el,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  });
}
function selectClosestInDirection(items: HTMLElement[], fromEl: HTMLElement, direction: Direction): Nullable<HTMLElement> {
  if (!fromEl || items.length === 0) return null;
  const rect = fromEl.getBoundingClientRect();
  const from: CenterPoint = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, el: fromEl };
  const centers = getItemCenters(items);
  const xTolerance = Math.max(rect.width / 2, 10);
  let filterFn: (c: CenterPoint) => boolean;
  switch (direction) {
    case 'ArrowUp':
      filterFn = (c) => c.y < from.y - 1 && Math.abs(c.x - from.x) <= xTolerance;
      break;
    case 'ArrowDown':
      filterFn = (c) => c.y > from.y + 1 && Math.abs(c.x - from.x) <= xTolerance;
      break;
    case 'ArrowLeft':
      filterFn = (c) => c.x < from.x - 1;
      break;
    case 'ArrowRight':
      filterFn = (c) => c.x > from.x + 1;
      break;
    default:
      return null;
  }
  const candidates = centers.filter((c) => c.el !== fromEl && filterFn(c));
  if (candidates.length === 0) return null;
  const distance2 = (a: CenterPoint, b: CenterPoint) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  };
  let best = candidates[0];
  let bestD2 = distance2(best, from);
  for (let i = 1; i < candidates.length; i++) {
    const d2 = distance2(candidates[i], from);
    if (d2 < bestD2) {
      best = candidates[i];
      bestD2 = d2;
    }
  }
  return best.el;
}
function moveFocus(targetEl: HTMLElement): void {
  if (!activeMenuElement || !targetEl) return;
  const current = getFocusedItem(activeMenuElement);
  if (current === targetEl) return;
  if (current) current.classList.remove('b3-list-item--focus');
  targetEl.classList.add('b3-list-item--focus');
  try {
    targetEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  } catch {}
}
function findNextByDomOrder(items: HTMLElement[], currentEl: HTMLElement): Nullable<HTMLElement> {
  const index = items.indexOf(currentEl);
  if (index === -1) return items[0] ?? null;
  if (index + 1 < items.length) return items[index + 1];
  return items[0] ?? null;
}
function findPrevByDomOrder(items: HTMLElement[], currentEl: HTMLElement): Nullable<HTMLElement> {
  const index = items.indexOf(currentEl);
  if (index === -1) return items[items.length - 1] ?? null;
  if (index - 1 >= 0) return items[index - 1];
  return items[items.length - 1] ?? null;
}
function getSameRowItems(items: HTMLElement[], fromEl: HTMLElement): HTMLElement[] {
  const fromRect = fromEl.getBoundingClientRect();
  const fromCenterY = fromRect.top + fromRect.height / 2;
  const sameRow: HTMLElement[] = [];
  for (const el of items) {
    if (el === fromEl) continue;
    const r = el.getBoundingClientRect();
    const cY = r.top + r.height / 2;
    const threshold = Math.min(fromRect.height, r.height) / 2;
    if (Math.abs(cY - fromCenterY) <= threshold) {
      sameRow.push(el);
    }
  }
  return sameRow;
}
function sortByXAscending(elements: HTMLElement[]): HTMLElement[] {
  return elements
    .map((el) => ({ el, x: el.getBoundingClientRect().left }))
    .sort((a, b) => a.x - b.x)
    .map((i) => i.el);
}
function sortByXDescending(elements: HTMLElement[]): HTMLElement[] {
  return elements
    .map((el) => ({ el, x: el.getBoundingClientRect().left }))
    .sort((a, b) => b.x - a.x)
    .map((i) => i.el);
}
const onKeyDownCapture = (evt: KeyboardEvent): void => {
  if (evt.key === '/') {
    endSession();
    isSessionActive = true;
    beginPollingForMenu();
    return;
  }
  if (!isSessionActive) return;
  if (evt.key === 'Escape') {
    endSession();
    return;
  }
  const directionKeys: Direction[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (!directionKeys.includes(evt.key as Direction)) {
    return;
  }
  const menu = activeMenuElement || findHintMenu();
  if (!menu || !isMenuVisible(menu)) {
    endSession();
    return;
  }
  evt.preventDefault();
  evt.stopPropagation();
  activeMenuElement = menu;
  attachObserversForActiveMenu();
  const items = getListItems(menu);
  if (items.length === 0) return;
  let focused = getFocusedItem(menu);
  if (!focused) {
    focused = items[0];
    focused.classList.add('b3-list-item--focus');
  }
  const target = selectClosestInDirection(items, focused, evt.key as Direction);
  if (target) {
    moveFocus(target);
    return;
  }
  let fallbackTarget: Nullable<HTMLElement> = null;
  const key = evt.key as Direction;
  if (key === 'ArrowDown') {
    fallbackTarget = findNextByDomOrder(items, focused);
  } else if (key === 'ArrowUp') {
    fallbackTarget = findPrevByDomOrder(items, focused);
  } else if (key === 'ArrowRight') {
    const rowItems = getSameRowItems(items, focused);
    if (rowItems.length > 0) {
      fallbackTarget = sortByXAscending(rowItems)[0] ?? null;
    }
  } else if (key === 'ArrowLeft') {
    const rowItems = getSameRowItems(items, focused);
    if (rowItems.length > 0) {
      fallbackTarget = sortByXDescending(rowItems)[0] ?? null;
    }
  }
  if (fallbackTarget && fallbackTarget !== focused) {
    moveFocus(fallbackTarget);
  }
};
export function initSlashNavi(): void {
  if (typeof document === 'undefined') return;
  if (keydownHandler) return;
  keydownHandler = onKeyDownCapture;
  document.addEventListener('keydown', keydownHandler, { capture: true });
}
export function destroySlashNavi(): void {
  if (typeof document === 'undefined') return;
  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler, { capture: true });
    keydownHandler = null;
  }
  endSession();
}
