import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadErrorState } from "@/components/LoadErrorState";
import { PageLayout } from "@/components/PageLayout";
import { TableCard } from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { adminMayOpenPath } from "@/features/access/admin-sidebar";
import { AdminNoAccess } from "@/features/admin/components/AdminNoAccess";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { BackendResponse } from "@/types";
import { listLookupEntries } from "../api/list-lookup-entries";
import { setLookupEntryActive } from "../api/set-lookup-entry-active";
import { LookupEditor, LookupEntryForm } from "../components/LookupEntryForm";
import { LookupEntryTable } from "../components/LookupEntryTable";
import { LookupEntry } from "../lookup-entry";
import { LookupResource } from "../lookup-resources";

type LookupManagementPageProps = {
	readonly resource: LookupResource;
};

function readListError(
	entries: readonly LookupEntry[],
	error: Error | { code: string; message: string } | undefined,
	language: string,
): string | null {
	if (entries.length > 0 || error === undefined) {
		return null;
	}
	if (isErrorResponse(error)) {
		return resolveErrorMessage(error, language);
	}
	if (error instanceof Error) {
		return error.message;
	}
	return null;
}

/**
 * List, create, edit and activate or deactivate one Lookup.
 * Hidden from an Admin who may not manage Lookups.
 */
export function LookupManagementPage({ resource }: LookupManagementPageProps) {
	const { me } = useRouteContext({ from: "__root__" });
	if (!adminMayOpenPath(me?.access ?? null, resource.routePath)) {
		return <AdminNoAccess reason="permission-denied" />;
	}
	return <LookupManagementScreen resource={resource} />;
}

function LookupManagementScreen({ resource }: LookupManagementPageProps) {
	const { t, i18n } = useTranslation();
	const [editor, setEditor] = useState<LookupEditor | null>(null);
	const {
		request: loadEntries,
		data,
		isLoading,
		error,
	} = useRequest<void, BackendResponse<LookupEntry[]>>(
		() => listLookupEntries(resource.collectionPath),
		{ fetchOnMount: true, showErrorToast: false },
	);
	const { request: requestActive, isLoading: isUpdating } = useRequest<
		Parameters<typeof setLookupEntryActive>[0],
		BackendResponse<LookupEntry>
	>(setLookupEntryActive);
	const entries = data?.data ?? [];
	const listError = readListError(entries, error, i18n.language);
	async function reloadEntries(): Promise<void> {
		await loadEntries().catch(() => undefined);
	}
	async function changeActive(
		entry: LookupEntry,
		isActive: boolean,
	): Promise<void> {
		try {
			await requestActive({
				collectionPath: resource.collectionPath,
				code: entry.code,
				isActive,
			});
			await reloadEntries();
		} catch {
			await reloadEntries();
		}
	}
	const addButton = (
		<Button type="button" onClick={() => setEditor({ mode: "create" })}>
			{t("admin.lookups.add")}
		</Button>
	);
	return (
		<PageLayout
			title={t(resource.titleKey)}
			description={t(resource.descriptionKey)}
			actions={addButton}
			className="gap-section"
		>
			<TableCard>
				{listError ? (
					<LoadErrorState description={listError} />
				) : (
					<LookupEntryTable
						entries={entries}
						isLoading={isLoading}
						isUpdating={isUpdating}
						showWindow={resource.hasScheduleWindow === true}
						onEdit={(entry) => setEditor({ mode: "edit", entry })}
						onSetActive={(entry, isActive) => {
							void changeActive(entry, isActive);
						}}
					/>
				)}
			</TableCard>
			<LookupEntryForm
				resource={resource}
				editor={editor}
				onClose={() => setEditor(null)}
				onSaved={async () => {
					setEditor(null);
					await reloadEntries();
				}}
			/>
		</PageLayout>
	);
}
