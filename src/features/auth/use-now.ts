import { useEffect, useState } from "react";

/**
 * The current time in epoch milliseconds, refreshed every second until
 * `untilMs` has passed. Counting down from a stored deadline with this keeps
 * the cooldown correct across refreshes.
 */
export function useNow(untilMs: number): number {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		setNow(Date.now());
		if (Date.now() >= untilMs) {
			return;
		}
		const timer = window.setInterval(() => {
			const current = Date.now();
			setNow(current);
			if (current >= untilMs) {
				window.clearInterval(timer);
			}
		}, 1000);
		return () => window.clearInterval(timer);
	}, [untilMs]);
	return now;
}
