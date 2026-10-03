import { useEffect, useState } from "react";
import {
	readPermissionDenied,
	subscribePermissionDenied,
} from "./permission-denied-state";

/** The in-page no-access flag, updated when a request is refused. */
export function usePermissionDenied(): boolean {
	const [isDenied, setIsDenied] = useState(readPermissionDenied);
	useEffect(() => {
		return subscribePermissionDenied(() => {
			setIsDenied(readPermissionDenied());
		});
	}, []);
	return isDenied;
}
