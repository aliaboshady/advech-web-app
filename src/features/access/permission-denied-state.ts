type Listener = () => void;

let isDenied = false;
const listeners = new Set<Listener>();

function notifyListeners(): void {
	for (const listener of listeners) {
		listener();
	}
}

/** Records that the backend refused an action for lack of Permission. */
export function notePermissionDenied(): void {
	isDenied = true;
	notifyListeners();
}

/** Clears the in-page no-access state, for example after navigation. */
export function clearPermissionDenied(): void {
	if (!isDenied) {
		return;
	}
	isDenied = false;
	notifyListeners();
}

/** Whether the current page should show the no-access state. */
export function readPermissionDenied(): boolean {
	return isDenied;
}

/** Subscribes to permission-denied changes. Returns an unsubscribe function. */
export function subscribePermissionDenied(listener: Listener): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
