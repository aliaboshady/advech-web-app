import { EyeIcon, MapIcon, RocketIcon, WalletIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { Chart } from "../components/Chart";
import { StatisticCard } from "../components/StatisticCard";
import { Table } from "../components/Table";

export function DashboardPage() {
	const { t } = useTranslation();

	return (
		<PageLayout
			title={t("sidebar.dashboard")}
			description={t("dashboard.description")}
			className="gap-section"
		>
			<div className="w-full gap-stack grid grid-cols-1 @sm/pageLayout:grid-cols-2 @3xl/pageLayout:grid-cols-4">
				<StatisticCard
					title={t("dashboard.statistics.totalImpressions")}
					description="12.4M"
					icon={<EyeIcon className="text-primary" />}
				/>
				<StatisticCard
					title={t("dashboard.statistics.activeCampaigns")}
					description="8"
					icon={<RocketIcon className="text-primary" />}
				/>
				<StatisticCard
					title={t("dashboard.statistics.reachByDistrict")}
					description="450K"
					icon={<MapIcon className="text-primary" />}
				/>
				<StatisticCard
					title={t("dashboard.statistics.budgetSpent")}
					description="$24.5K"
					icon={<WalletIcon className="text-primary" />}
				/>
			</div>

			<div className="flex w-full flex-col items-stretch gap-section @3xl/pageLayout:flex-row">
				<Chart />
				<Table />
			</div>
		</PageLayout>
	);
}
