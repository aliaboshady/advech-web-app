import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(() => {
		const savedTheme = localStorage.getItem("theme");

		if (savedTheme) {
			return savedTheme === "dark";
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
	}, [isDark]);

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			aria-pressed={isDark}
			onClick={() => setIsDark((current) => !current)}
			className="inline-flex items-center gap-2 rounded-full"
		>
			{isDark ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
			<span>{isDark ? "Light Mode" : "Dark Mode"}</span>
		</Button>
	);
}
