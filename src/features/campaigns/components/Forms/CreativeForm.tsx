import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FileUploadDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";

export function CreativeForm() {
	const { t } = useTranslation();
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);

	return (
		<div className="@container bg-primary-foreground w-full h-full sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl">
			<div className="flex flex-col gap-4 items-center h-full max-h-90">
				<FileUploadDropzone
					file={file}
					setFile={setFile}
					type="video"
					maxSize={15000000}
				/>

				<Button variant="secondary" disabled={!file}>
					UPLOAD
				</Button>
			</div>

			<div className="w-full flex justify-end items-end">
				<Button
					onClick={async () =>
						await router.navigate({ to: "/campaigns/$id/targeting" })
					}
					className="w-full @sm:w-fit"
				>
					{t("Save and continue")}
				</Button>
			</div>
		</div>
	);
}
