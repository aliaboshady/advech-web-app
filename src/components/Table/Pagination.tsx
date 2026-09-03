"use client";

import { ChevronLastIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { PaginatedResponse } from "@/types";
import { DropdownItemsPerPage } from "./DropdownItemsPerPage";

type Props = {
	currentPage: number;
	setPage: (val: number) => void;
	dataPagination: PaginatedResponse<any>;
	itemsPerPage?: number;
	setItemsPerPage?: (val: number) => void;
	className?: string;
	maxPageButtons?: number;
};

const Pagination = ({
	currentPage,
	setPage,
	dataPagination,
	itemsPerPage,
	setItemsPerPage,
	className,
	maxPageButtons = 5,
}: Props) => {
	const { t } = useTranslation();
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		if (dataPagination) {
			setTotalPages(dataPagination?.data?.totalPages ?? 0);
		}
	}, [dataPagination]);

	const startPage = Math.max(
		Math.min(
			currentPage - Math.floor(maxPageButtons / 2) - 1,
			totalPages - maxPageButtons,
		),
		0,
	);

	const pageButtons = Array.from(
		{ length: Math.min(maxPageButtons, totalPages) },
		(_, i) => startPage + i + 1,
	);

	const totalItems = dataPagination?.data?.totalItems ?? 0;
	const limit = dataPagination?.data?.limit ?? 0;
	const startItem = (currentPage - 1) * limit + (totalItems > 0 ? 1 : 0);
	const endItem = Math.min(currentPage * limit, totalItems);

	return (
		<div
			className={twMerge(
				"flex flex-col sm:flex-row items-center justify-between gap-5 transition-all",
				className,
			)}
		>
			<div className="flex flex-row items-center justify-between gap-5 order-2 sm:order-1">
				{itemsPerPage && setItemsPerPage && (
					<DropdownItemsPerPage
						itemsPerPage={itemsPerPage}
						setCurrentItemsPerPage={setItemsPerPage}
					/>
				)}

				<span className="text-sm text-muted-foreground">
					{startItem || 0} - {endItem || 0} {t("common.of")} {totalItems || 0}
				</span>
			</div>

			<div className="flex items-center order-1 sm:order-2">
				<button
					type="button"
					className="p-2 group text-foreground/70 disabled:pointer-events-none hover:text-foreground"
					disabled={currentPage === 1}
					onClick={() => setPage?.(1)}
				>
					<ChevronLastIcon
						className={`w-3 h-3 ltr:rotate-180 ${
							currentPage === 1
								? "text-foreground/55"
								: "text-foreground/75 group-hover:text-foreground"
						}`}
					/>
				</button>

				<button
					type="button"
					className="p-2 group text-foreground/70 disabled:pointer-events-none hover:text-foreground"
					disabled={currentPage === 1}
					onClick={() => setPage?.(currentPage - 1)}
				>
					<ChevronRightIcon
						className={`w-3 h-3 ltr:rotate-180 ${
							currentPage === 1
								? "text-foreground/55"
								: "text-foreground/75 group-hover:text-foreground"
						}`}
					/>
				</button>

				{pageButtons.map((pageNumber) => (
					<button
						type="button"
						key={pageNumber}
						onClick={() => setPage?.(pageNumber)}
						className={`px-2 h-8 rounded transition-all ${
							currentPage === pageNumber
								? "bg-secondary text-secondary-foreground"
								: "text-muted-foreground hover:text-foreground hover:bg-muted"
						}`}
					>
						{pageNumber}
					</button>
				))}

				<button
					type="button"
					className="p-2 group text-foreground/70 disabled:pointer-events-none hover:text-foreground"
					disabled={currentPage >= totalPages}
					onClick={() => setPage?.(currentPage + 1)}
				>
					<ChevronRightIcon
						className={`w-3 h-3 rtl:rotate-180 ${
							currentPage >= totalPages
								? "text-foreground/55"
								: "text-foreground/75 group-hover:text-foreground"
						}`}
					/>
				</button>

				<button
					type="button"
					className="p-2 group text-foreground/70 disabled:pointer-events-none hover:text-foreground"
					disabled={currentPage >= totalPages}
					onClick={() => setPage?.(totalPages)}
				>
					<ChevronLastIcon
						className={`w-3 h-3 rtl:rotate-180 ${
							currentPage >= totalPages
								? "text-foreground/55"
								: "text-foreground/75 group-hover:text-foreground"
						}`}
					/>
				</button>
			</div>
		</div>
	);
};

export default Pagination;
