import { twMerge } from "tailwind-merge";

type Props = {
	title?: string;
	className?: string;
	children: React.ReactNode;
};

export function PageLayout({ title, children, className }: Props) {
	return (
		<div
			className={twMerge(
				"@container/pageLayout flex w-full flex-col items-center p-4",
				className,
			)}
		>
			{title && <p className="w-full text-xl font-semibold">{title}</p>}
			{children}
		</div>
	);
}
