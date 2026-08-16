import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center p-8">
			<div className="space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight">Welcome to Advech</h1>
				<p className="text-lg text-muted-foreground">
					You are logged in and on the home page.
				</p>
			</div>
		</div>
	);
}
