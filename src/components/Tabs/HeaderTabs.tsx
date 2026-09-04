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
			<div className="flex flex-row gap-4 items-center py-4 overflow-x-auto scrollbar-thin transition-all">
				{tabs.map((tab, i) => (
					<Fragment key={i}>
						<Tab
							title={tab.title}
							activeTabId={tab.id === activeTabId}
							redirect={`${url}/${tab.url}`}
							disabled={tab.disabled}
							done={tab.done}
							// submit={handleSubmit}
						/>

						{i < tabs.length - 1 && (
							<div className="w-20 border-t border-dashed border-primary -translate-y-3" />
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
}
