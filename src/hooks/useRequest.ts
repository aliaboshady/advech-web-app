import { useTopLoader } from "nextjs-toploader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/types";

type RequestOptions<R> = {
	onSuccess?: (data: R) => void;
	onError?: (error: Error) => void;
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
	const [error, setError] = useState<Error | null>(null);
	const { start: startTopLoader, done: doneTopLoader } = useTopLoader();

	const request = async (payload: P): Promise<R> => {
		// Browser-only: Check internet connection
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			const offlineError = new Error("No internet connection.");
			setError(offlineError);
			onError?.(offlineError);

			if (showErrorToast) {
				toast.error(
					"No internet connection. Please check your network and try again.",
				);
			}

			throw offlineError;
		}

		setIsLoading(true);
		onStart?.();
		setError(null);

		try {
			if (showTopLoader) startTopLoader();

			const result = await queryFn(payload);

			const errors: ErrorResponse = (result as any)?.error;
			if (errors) {
				if (showErrorToast) {
					errors?.general?.forEach((error) => toast.error(error));
				}
			} else {
				setData(result);
				setIsSuccess(true);
				onSuccess?.(result);

				if (showSuccessToast && (result as any)?.message) {
					toast.success((result as any)?.message);
				}
			}

			return result;
		} catch (err: any) {
			const typedError = err instanceof Error ? err : new Error(String(err));

			setError(typedError);
			setIsSuccess(false);
			onError?.(typedError);

			if (showErrorToast) {
				toast.error(typedError.message);
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

	return { request, data, isLoading, isSuccess, error, reset };
};

export default useRequest;
