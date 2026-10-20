// Which way a screen slides in when you switch tabs: the tabs are in a row (Garage, Store, Race, History, Settings), so going to
// a tab on the right slides the new screen in from the right, and going to one on the left slides it in from the left.

export type TabSlide = 'slide_from_right' | 'slide_from_left';

let next: TabSlide = 'slide_from_right';

/** Call right before navigating from the tab at `fromIndex` to the one at `toIndex`. */
export function noteTabChange(fromIndex: number, toIndex: number): void {
  next = toIndex < fromIndex ? 'slide_from_left' : 'slide_from_right';
}

/** The animation for the tab screen that is about to appear. */
export function tabAnimation(): TabSlide {
  return next;
}

let currentPath = '/';

/** The screen that is showing, kept here so gesture callbacks (created once) can read it. */
export function setCurrentPath(path: string): void {
  currentPath = path;
}

export function getCurrentPath(): string {
  return currentPath;
}
