import { type MouseEvent } from "react";
import i18n from "@/i18n";

type Props = {
	label1: string;
	label2: string;
	value: boolean;
	setValue: (val: boolean) => void;
};

const Switch = ({ label1, label2, value, setValue }: Props) => {
	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setValue(!value);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="bg-secondary h-fit w-fit rounded-full p-1 text-sm font-semibold text-secondary-foreground"
		>
			<div className="relative grid grid-cols-2 gap-4 px-2">
				<div
					className={`bg-primary absolute top-0 inset-s-0 h-full w-1/2 rounded-full transition-all ${
						value
							? i18n.dir() === "ltr"
								? "translate-x-full"
								: "-translate-x-full"
							: "translate-x-0"
					}`}
				/>

				<p className={`z-10 ${!value && "text-primary-foreground"}`}>
					{label1}
				</p>
				<p className={`z-10 ${value && "text-primary-foreground"}`}>{label2}</p>
			</div>
		</button>
	);
};

export default Switch;
