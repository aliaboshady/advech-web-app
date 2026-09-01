import { EyeIcon, MapIcon, RocketIcon, WalletIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoLockup from "@/assets/logo/lockup/advech-lockup-orange.svg";
import { PageLayout } from "@/components/PageLayout";
import { StatisticCard } from "../components/StatisticCard";

export function DashboardPage() {
	const { t } = useTranslation();

	return (
		<PageLayout title={t("sidebar.dashboard")}>
			<div className="w-full gap-4 grid grid-cols-1 @sm/pageLayout:grid-cols-2 @3xl/pageLayout:grid-cols-4">
				<StatisticCard
					title="Total Impressions"
					description="12.4M"
					icon={<EyeIcon className="text-primary" />}
				/>
				<StatisticCard
					title="Active Campaigns"
					description="8"
					icon={<RocketIcon className="text-primary" />}
				/>
				<StatisticCard
					title="Reach by District"
					description="450K"
					icon={<MapIcon className="text-primary" />}
				/>
				<StatisticCard
					title="Budget Spent"
					description="$24.5K"
					icon={<WalletIcon className="text-primary" />}
				/>
			</div>

			<div className="flex w-full items-center justify-center p-8">
				<div className="space-y-4 text-center">
					<img
						src={logoLockup}
						alt="Advech"
						className="mx-auto h-auto w-full max-w-xs"
					/>
					<h1 className="text-4xl font-bold tracking-tight text-primary">
						{t("home.welcome")}
					</h1>
					<p className="text-lg text-muted-foreground">{t("home.loggedIn")}</p>
				</div>
			</div>
		</PageLayout>
	);
}
