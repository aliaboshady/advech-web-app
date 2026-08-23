import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/features/auth/pages/SignupPage";

export const Route = createFileRoute("/_public/auth/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignupPage />;
}
