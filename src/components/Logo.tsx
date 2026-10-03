import iconOrange from "@/assets/logo/icon/advech-icon-orange.svg";
import iconWhite from "@/assets/logo/icon/advech-icon-white.svg";
import wordmarkOrange from "@/assets/logo/wordmark/advech-wordmark-orange.svg";
import wordmarkWhite from "@/assets/logo/wordmark/advech-wordmark-white.svg";
import { cn } from "@/lib/utils";

type Props = {
	variant: "icon" | "wordmark";
	className?: string;
	/** Pass "" when the logo sits next to the wordmark, so it is announced once. */
	alt?: string;
};

const assets = {
	icon: { light: iconOrange, dark: iconWhite },
	wordmark: { light: wordmarkOrange, dark: wordmarkWhite },
};

/**
 * The Advech icon or wordmark: orange on the light theme, white on the dark
 * theme. Both assets are rendered and the `dark` class on <html> (set by
 * src/lib/theme.ts) decides which one shows, so no JS state is involved.
 */
export function Logo({ variant, className, alt = "Advech" }: Props) {
	const { light, dark } = assets[variant];
	return (
		<>
			<img src={light} alt={alt} className={cn("dark:hidden", className)} />
			<img
				src={dark}
				alt={alt}
				className={cn("hidden dark:block", className)}
			/>
		</>
	);
}
