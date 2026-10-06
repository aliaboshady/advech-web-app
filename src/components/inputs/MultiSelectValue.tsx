import { XIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Item } from "@/types";
import { Badge } from "../ui/badge";

type MultiSelectValueProps = {
	items: Item[];
	removeSelection?: (item: string) => void;
	expandMode?: "countOnly" | "showSome" | "showAll";
};

export function MultiSelectValue({
	items,
	removeSelection,
	expandMode = "countOnly",
}: MultiSelectValueProps) {
	const { t } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(items.length);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const calculate = () => {
			const containerWidth = container.offsetWidth;

			// Get measurement items from the invisible container
			const measurementNode = container.querySelector<HTMLElement>(
				".measurement-container",
			);
			if (!measurementNode) return;

			const children = Array.from(measurementNode.children) as HTMLElement[];
			const badgeWidths = children
				.slice(0, items.length)
				.map((el) => el.offsetWidth);
			const moreBadgeWidth = children[items.length]?.offsetWidth ?? 0;

			let totalWidth = 0;
			let newVisibleCount = 0;

			for (let i = 0; i < badgeWidths.length; i++) {
				totalWidth += badgeWidths[i] + 4; // 4px for gap
				if (totalWidth > containerWidth) {
					const widthWithoutCurrent = totalWidth - badgeWidths[i] - 4;
					const widthWithMore = widthWithoutCurrent + moreBadgeWidth + 4;

					if (widthWithMore > containerWidth && i > 0) {
						newVisibleCount = i - 1;
					} else {
						newVisibleCount = i;
					}
					setVisibleCount(newVisibleCount);
					return;
				}
			}
			setVisibleCount(items.length);
		};

		const observer = new ResizeObserver(calculate);
		observer.observe(container);

		// Initial calculation
		calculate();

		return () => observer.disconnect();
	}, [items]);

	const hiddenCount = items.length - visibleCount;

	return (
		<div
			ref={containerRef}
			className="flex flex-wrap items-center gap-1 overflow-hidden h-full w-full"
		>
			{expandMode === "countOnly" && (
				<p>
					{t("common.selectedItems")} {items.length}
				</p>
			)}

			{/* Render visible items */}
			{(expandMode === "showSome" || expandMode === "showAll") &&
				items
					.slice(0, expandMode === "showAll" ? items.length : visibleCount)
					.map((item) => (
						<Badge key={item.value} className="shrink-0">
							{item.label}

							<div
								role="button"
								tabIndex={10}
								className="relative z-50"
								onPointerDown={(e) => {
									e.preventDefault();
									removeSelection?.(item?.value);
								}}
							>
								<XIcon className="ms-2" />
							</div>
						</Badge>
					))}

			{/* Render "more" badge if needed */}
			{expandMode === "showSome" && hiddenCount > 0 && (
				<Badge variant="secondary" className="shrink-0 text-primary">
					+{hiddenCount}
				</Badge>
			)}

			{/* Render all items invisibly for measurement */}
			<div className="measurement-container flex absolute invisible -z-10 flex-nowrap">
				{items.map((item) => (
					<Badge key={item.value} className="shrink-0">
						{item.label}
					</Badge>
				))}
				<Badge className="shrink-0">+{items.length}</Badge>
			</div>
		</div>
	);
}
