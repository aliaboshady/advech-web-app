import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

type Props = {
	columns: number;
	rows?: number;
};

/** Placeholder table rows that keep the layout of the rows they stand in for. */
export function TableSkeletonRows({ columns, rows = 5 }: Props) {
	return Array.from({ length: rows }, (_, row) => (
		<TableRow key={row} aria-hidden="true" className="hover:bg-transparent">
			{Array.from({ length: columns }, (_, column) => (
				<TableCell key={column} className="ps-5">
					<Skeleton className="h-4 w-full max-w-40" />
				</TableCell>
			))}
		</TableRow>
	));
}
