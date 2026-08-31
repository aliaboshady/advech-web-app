import { useNavigate, useRouter } from "@tanstack/react-router";
import { clearTokens } from "@/lib/tokenUtils";

export function useLogout() {
	const navigate = useNavigate();
	const router = useRouter();

	const handleLogout = async () => {
		clearTokens();

		await router.invalidate();

		await navigate({
			to: "/auth/login",
		});
	};

	return { handleLogout };
}
