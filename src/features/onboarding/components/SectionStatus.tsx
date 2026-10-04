import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

/** Whether a card still has something missing, from the server's `missingFields`. */
export function SectionStatus({ complete }: { complete: boolean }) {
	const { t } = useTranslation();
	return (
		<Badge variant={complete ? "success" : "warning"}>
			{complete ? (
				<CheckCircle2Icon aria-hidden="true" />
			) : (
				<AlertCircleIcon aria-hidden="true" />
			)}
			{t(
				complete
					? "onboarding.section.complete"
					: "onboarding.section.incomplete",
			)}
		</Badge>
	);
}
