import { twMerge } from "tailwind-merge";
import noData from "@/assets/no-data-amico.svg";

type Props = {
	className?: string;
};

const NoDataFound = ({ className }: Props) => {
	return (
		<img
			src={noData}
			alt="No Data Found"
			className={twMerge("w-full h-full object-contain", className)}
		/>
	);
};

export default NoDataFound;
