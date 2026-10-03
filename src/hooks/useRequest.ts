import { useTopLoader } from "nextjs-toploader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
	const [data, setData] = useState<R | null>(null);
	const [isLoading, setIsLoading] = useState(fetchOnMount);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<Error | ErrorResponse | null>(null);

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
		setError(null);
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

				onError?.(normalizedError);

				if (showErrorToast) {
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
		setData(null);
		setError(null);
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
