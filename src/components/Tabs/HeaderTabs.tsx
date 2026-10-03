import { Fragment } from "react";
import { Tab } from "./Tab";

type Props = {
	url?: string;
	activeTabId: number;
	tabs: {
		id: number;
		title: string;
		url?: string;
		disabled?: boolean;
		done?: boolean;
	}[];
};

export function HeaderTabs({ url, activeTabId, tabs }: Props) {
	return (
		<div className="flex justify-center">
			<div className="scrollbar-thin flex flex-row items-center gap-2 overflow-x-auto px-1 py-2 sm:gap-4">
				{tabs.map((tab, i) => (
					<Fragment key={tab.id}>
						<Tab
							title={tab.title}
							activeTabId={tab.id === activeTabId}
							redirect={`${url}/${tab.url}`}
							disabled={tab.disabled}
							done={tab.done}
						/>

						{i < tabs.length - 1 && (
							<div
								aria-hidden="true"
								className="w-8 -translate-y-3 border-t border-dashed border-border sm:w-20"
							/>
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
}
