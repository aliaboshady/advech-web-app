import { useTopLoader } from "nextjs-toploader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isPermissionDenied } from "@/features/access/is-permission-denied";
import { notePermissionDenied } from "@/features/access/permission-denied-state";
import { clearCachedOnboarding } from "@/features/onboarding/load-cached-onboarding";
import { isNotApproved } from "@/features/onboarding/onboarding-errors";
import { ONBOARDING_HOME } from "@/features/onboarding/onboarding-view";
import { requestSessionRefresh } from "@/features/users/refresh-session";
import i18n from "@/i18n";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { ErrorResponse } from "@/types";

type RequestOptions<R> = {
	onSuccess?: (data: R) => void | Promise<void>;
	onError?: (error: Error | ErrorResponse) => void;
	onStart?: () => void;
	onFinish?: () => void;
	fetchOnMount?: boolean;
	showTopLoader?: boolean;
	showSuccessToast?: boolean;
	showErrorToast?: boolean;
};

const useRequest = <P, R>(
	queryFn: (payload: P) => Promise<R>,
	{
		onSuccess,
		onError,
		onStart,
		onFinish,
		fetchOnMount = false,
		showTopLoader = true,
		showSuccessToast = false,
		showErrorToast = true,
	}: RequestOptions<R> = {},
) => {
	const [data, setData] = useState<R | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(fetchOnMount);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<Error | ErrorResponse | undefined>(
		undefined,
	);

	const { start: startTopLoader, done: doneTopLoader } = useTopLoader();

	const request = async (payload: P): Promise<R> => {
		// Browser-only: Check internet connection
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			const offlineError = new Error(i18n.t("errors.offline"));
			setError(offlineError);
			setIsSuccess(false);
			onError?.(offlineError);

			if (showErrorToast) {
				toast.error(offlineError.message);
			}

			throw offlineError;
		}

		setIsLoading(true);
		setIsSuccess(false);
		setError(undefined);
		onStart?.();

		try {
			if (showTopLoader) {
				startTopLoader();
			}

			const result = await queryFn(payload);

			const serverError = (result as { error?: ErrorResponse })?.error;

			if (serverError) {
				const normalizedError: ErrorResponse = {
					...serverError,
					details: serverError.details ?? [],
				};

				setError(normalizedError);
				setIsSuccess(false);
				const permissionDenied = isPermissionDenied(normalizedError);
				if (permissionDenied) {
					notePermissionDenied();
					requestSessionRefresh();
				}
				const notApproved = isNotApproved(normalizedError);
				if (notApproved) {
					// The status changed under this page. Drop the cached state and let
					// the router's gate send the user to the right status screen.
					clearCachedOnboarding();
					requestSessionRefresh();
				}
				onError?.(normalizedError);
				if (notApproved) {
					if (showErrorToast && window.location.pathname === ONBOARDING_HOME) {
						toast.info(i18n.t("onboarding.notApprovedYet"));
					}
				} else if (showErrorToast) {
					toast.error(resolveErrorMessage(normalizedError, i18n.language));
				}

				throw normalizedError;
			}

			setData(result);
			setIsSuccess(true);
			await onSuccess?.(result);

			if (showSuccessToast && (result as { message?: string })?.message) {
				toast.success((result as { message?: string }).message);
			}

			return result;
		} catch (err) {
			const typedError =
				err instanceof Error || isErrorResponse(err)
					? err
					: new Error(String(err));

			setError(typedError);
			setIsSuccess(false);

			// Don't call onError twice for backend errors.
			if (!isErrorResponse(typedError)) {
				onError?.(typedError);

				if (showErrorToast) {
					toast.error(typedError.message);
				}
			}

			throw typedError;
		} finally {
			doneTopLoader();
			setIsLoading(false);
			onFinish?.();
		}
	};

	const reset = () => {
		setData(undefined);
		setError(undefined);
		setIsLoading(false);
		setIsSuccess(false);
	};

	useEffect(() => {
		if (fetchOnMount) {
			request(undefined as unknown as P).catch(() => {});
		}
	}, [fetchOnMount]);

	return {
		request,
		data,
		isLoading,
		isSuccess,
		error,
		reset,
	};
};

export default useRequest;
