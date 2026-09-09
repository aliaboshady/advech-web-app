import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Slider({
	className,
	...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
	return (
		<SliderPrimitive.Root
			data-slot="slider"
			className={cn(
				"relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-32 data-[orientation=vertical]:w-2 data-[orientation=vertical]:flex-col",
				className,
			)}
			{...props}
		>
			<SliderPrimitive.Track
				data-slot="slider-track"
				className="bg-input relative h-2 w-full grow overflow-hidden rounded-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
			>
				<SliderPrimitive.Range
					data-slot="slider-range"
					className="bg-primary absolute h-full data-[orientation=vertical]:bottom-0 data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full"
				/>
			</SliderPrimitive.Track>
			{(props.value ?? props.defaultValue ?? [0]).map((_, index) => (
				<SliderPrimitive.Thumb
					key={index}
					data-slot="slider-thumb"
					className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none"
				/>
			))}
		</SliderPrimitive.Root>
	);
}

export { Slider };
