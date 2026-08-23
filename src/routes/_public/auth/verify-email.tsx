import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";

export const Route = createFileRoute("/_public/auth/verify-email")({
	component: RouteComponent,
});

function RouteComponent() {
	return <VerifyEmailPage />;
}
