// Developer-facing reference page for the shared UI primitives. It is only
// mounted in development (see routes/design-system.tsx), so its labels are
// plain English and deliberately skip i18n. It never touches the saved theme
// or language: the switchers below only set attributes on <html> and restore
// them on leave.
import {
	ArrowRightIcon,
	BellIcon,
	ChevronDownIcon,
	PlusIcon,
	Trash2Icon,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import ConfirmationDialog from "@/components/Dialogs/ConfirmationDialog";
import { FormSectionCard } from "@/components/FormSectionCard";
import TextInput from "@/components/Inputs/TextInput";
import Dropdown from "@/components/inputs/Dropdown";
import { Logo } from "@/components/Logo";
import NoDataFound from "@/components/NoDataFound";
import { PageLayout } from "@/components/PageLayout";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { TableSkeletonRows } from "@/components/Table/TableSkeletonRows";
import {
	TableCard,
	TableCardFooter,
	TableCardHeader,
	TableCardToolbar,
} from "@/components/TableCard";
import { Tab } from "@/components/Tabs/Tab";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ADVERTISER_STATUSES } from "@/features/admin/advertisers/advertiser-summary";
import { CAMPAIGN_STATUSES } from "@/features/campaigns/types";

type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

const BUTTON_VARIANTS = [
	"primary",
	"secondary",
	"outline",
	"ghost",
	"destructive",
	"link",
] as const;

const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;

const BADGE_VARIANTS = [
	"default",
	"secondary",
	"success",
	"warning",
	"info",
	"destructive",
	"outline",
	"ghost",
	"link",
] as const;

const SWATCHES = [
	["background", "bg-background"],
	["card", "bg-card"],
	["secondary", "bg-secondary"],
	["muted", "bg-muted"],
	["accent", "bg-accent"],
	["primary", "bg-primary"],
	["success", "bg-success"],
	["warning", "bg-warning"],
	["info", "bg-info"],
	["destructive", "bg-destructive"],
] as const;

const DROPDOWN_ITEMS = [
	{ value: "one", label: "First option" },
	{ value: "two", label: "Second option" },
	{ value: "three", label: "Third option" },
];

/** Sets theme and direction on <html> and restores the originals on leave. */
function usePreviewSettings(theme: Theme, direction: Direction) {
	useEffect(() => {
		const root = document.documentElement;
		const original = {
			dark: root.classList.contains("dark"),
			dir: root.dir,
			lang: root.lang,
		};
		return () => {
			root.classList.toggle("dark", original.dark);
			root.dir = original.dir;
			root.lang = original.lang;
		};
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", theme === "dark");
		root.dir = direction;
		root.lang = direction === "rtl" ? "ar" : "en";
	}, [theme, direction]);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-headline-md">{title}</h2>
			{children}
		</section>
	);
}

function Row({ label, children }: { label?: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2">
			{label && (
				<p className="text-label-caps text-muted-foreground">{label}</p>
			)}
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</div>
	);
}

function Switcher<T extends string>({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: T;
	options: readonly T[];
	onChange: (next: T) => void;
}) {
	return (
		<fieldset className="flex items-center gap-2">
			<legend className="sr-only">{label}</legend>
			<span className="text-label-caps text-muted-foreground">{label}</span>
			{options.map((option) => (
				<Button
					key={option}
					type="button"
					size="sm"
					variant={option === value ? "secondary" : "outline"}
					aria-pressed={option === value}
					onClick={() => onChange(option)}
				>
					{option.toUpperCase()}
				</Button>
			))}
		</fieldset>
	);
}

export default function DesignSystemPage() {
	const [theme, setTheme] = useState<Theme>(() =>
		document.documentElement.classList.contains("dark") ? "dark" : "light",
	);
	const [direction, setDirection] = useState<Direction>(() =>
		document.documentElement.dir === "rtl" ? "rtl" : "ltr",
	);
	const [single, setSingle] = useState("one");
	const [multi, setMulti] = useState<string[]>(["one", "two"]);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [slider, setSlider] = useState([40]);
	const [confirmOpen, setConfirmOpen] = useState(false);

	usePreviewSettings(theme, direction);

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background text-foreground">
				<header className="sticky top-0 z-40 bg-background flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3">
					<div>
						<h1 className="text-headline-lg">Design system</h1>
						<p className="text-body-md text-muted-foreground">
							Development-only reference for the shared primitives.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						<Switcher
							label="Theme"
							value={theme}
							options={["light", "dark"] as const}
							onChange={setTheme}
						/>
						<Switcher
							label="Direction"
							value={direction}
							options={["ltr", "rtl"] as const}
							onChange={setDirection}
						/>
					</div>
				</header>

				<main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10">
					<Section title="Typography">
						<div className="flex flex-col gap-2">
							<p className="text-display">Display 40</p>
							<p className="text-headline-lg">Headline large 28</p>
							<p className="text-headline-md">Headline medium 20</p>
							<p className="text-body-lg">Body large 16, the quick brown fox</p>
							<p className="text-body-md">
								Body medium 14, the quick brown fox
							</p>
							<p className="text-label-caps">Label caps 12</p>
							<p className="text-body-md" lang="ar">
								نص عربي للتجربة، الخط يتغير مع اللغة
							</p>
						</div>
					</Section>

					<Section title="Colour tokens">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
							{SWATCHES.map(([name, className]) => (
								<div key={name} className="flex flex-col gap-1">
									<div className={`${className} h-12 rounded-md border`} />
									<span className="text-label-caps text-muted-foreground">
										{name}
									</span>
								</div>
							))}
						</div>
					</Section>

					<Section title="Button">
						{BUTTON_VARIANTS.map((variant) => (
							<div key={variant} className="flex flex-col gap-3">
								<Row label={`${variant}: sizes`}>
									{BUTTON_SIZES.map((size) => (
										<Button key={size} variant={variant} size={size}>
											{size}
										</Button>
									))}
									<Button variant={variant} size="icon" aria-label="Add">
										<PlusIcon />
									</Button>
								</Row>
								<Row label={`${variant}: states`}>
									<Button variant={variant}>Default</Button>
									<Button variant={variant} disabled>
										Disabled
									</Button>
									<Button variant={variant} aria-invalid="true">
										Invalid
									</Button>
									<Button variant={variant}>
										Next
										<ArrowRightIcon className="rtl:rotate-180" />
									</Button>
								</Row>
							</div>
						))}
						<p className="text-body-md text-muted-foreground">
							Hover, press and Tab onto any control to see the hover, active and
							focus states. Only primary carries the glow.
						</p>
					</Section>

					<Section title="Inputs">
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="ds-input">Input</Label>
								<Input id="ds-input" placeholder="Placeholder" />
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="ds-input-value">Input with value</Label>
								<Input id="ds-input-value" defaultValue="Some value" />
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="ds-input-disabled">Disabled</Label>
								<Input id="ds-input-disabled" disabled defaultValue="Locked" />
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="ds-input-invalid">Invalid</Label>
								<Input
									id="ds-input-invalid"
									aria-invalid="true"
									defaultValue="Wrong"
								/>
								<p className="text-body-md text-destructive">
									This value is not valid.
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="ds-textarea">Textarea</Label>
								<Textarea id="ds-textarea" placeholder="Placeholder" />
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="ds-textarea-invalid">Textarea invalid</Label>
								<Textarea
									id="ds-textarea-invalid"
									aria-invalid="true"
									defaultValue="Wrong"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Dropdown (single)</Label>
								<Dropdown
									selected={single}
									setSelected={setSingle}
									items={DROPDOWN_ITEMS}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Dropdown (multi)</Label>
								<Dropdown
									multiSelect
									multiSelectExpandMode="showSome"
									selected={multi}
									setSelected={setMulti}
									items={DROPDOWN_ITEMS}
								/>
							</div>
						</div>
						<Row label="Checkbox">
							<Checkbox aria-label="Unchecked" />
							<Checkbox aria-label="Checked" defaultChecked />
							<Checkbox aria-label="Disabled" disabled />
							<Checkbox aria-label="Disabled checked" disabled defaultChecked />
							<Checkbox aria-label="Invalid" aria-invalid="true" />
						</Row>
						<div className="flex max-w-sm flex-col gap-4">
							<Row label="Slider">
								<Slider
									value={slider}
									onValueChange={setSlider}
									max={100}
									aria-label="Slider"
								/>
							</Row>
							<Slider
								defaultValue={[30]}
								disabled
								aria-label="Disabled slider"
							/>
						</div>
					</Section>

					<Section title="Status badge">
						<Row>
							{ADVERTISER_STATUSES.map((status) => (
								<StatusBadge key={status} kind="advertiser" status={status} />
							))}
						</Row>
						<Row>
							{CAMPAIGN_STATUSES.map((status) => (
								<StatusBadge key={status} kind="campaign" status={status} />
							))}
						</Row>
					</Section>

					<Section title="Badge">
						<Row>
							{BADGE_VARIANTS.map((variant) => (
								<Badge key={variant} variant={variant}>
									{variant}
								</Badge>
							))}
						</Row>
					</Section>

					<Section title="Card">
						<div className="grid gap-4 sm:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Card title</CardTitle>
									<CardDescription>
										Description text sits under the title.
									</CardDescription>
									<CardAction>
										<Button variant="ghost" size="icon-sm" aria-label="Alerts">
											<BellIcon />
										</Button>
									</CardAction>
								</CardHeader>
								<CardContent>
									<p>Card content is flat: no glow, no glass.</p>
								</CardContent>
								<CardFooter className="justify-end gap-2">
									<Button variant="outline">Cancel</Button>
									<Button>Save</Button>
								</CardFooter>
							</Card>
							<Card size="sm">
								<CardHeader>
									<CardTitle>Small card</CardTitle>
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</CardContent>
							</Card>
						</div>
					</Section>

					<Section title="Table">
						<Card>
							<CardContent>
								<Table>
									<TableCaption>A caption for the table.</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Budget</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell>Spring launch</TableCell>
											<TableCell>
												<Badge variant="success">Approved</Badge>
											</TableCell>
											<TableCell>1,200</TableCell>
										</TableRow>
										<TableRow data-state="selected">
											<TableCell>Summer sale (selected)</TableCell>
											<TableCell>
												<Badge variant="info">Pending</Badge>
											</TableCell>
											<TableCell>800</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Autumn push</TableCell>
											<TableCell>
												<Badge variant="warning">Needs changes</Badge>
											</TableCell>
											<TableCell>450</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</Section>

					<Section title="Logo">
						<Row label="Icon and wordmark (orange on light, white on dark)">
							<Logo variant="icon" className="size-8" />
							<Logo variant="wordmark" className="h-5 w-auto" />
						</Row>
					</Section>

					<Section title="Page layout and spacing scale">
						<p className="text-body-md text-muted-foreground">
							PageLayout takes title, description and actions. Gutters use
							p-page, gaps between sections use gap-section, gaps between
							related items inside a section use gap-stack.
						</p>
						<div className="rounded-lg border border-border bg-background">
							<PageLayout
								title="Campaigns"
								description="Every Campaign you have created."
								actions={<Button>New Campaign</Button>}
								className="gap-section"
							>
								<div className="rounded-lg border border-dashed border-border p-4 text-body-md text-muted-foreground">
									Section one
								</div>
								<div className="rounded-lg border border-dashed border-border p-4 text-body-md text-muted-foreground">
									Section two
								</div>
							</PageLayout>
						</div>
						<div className="rounded-lg border border-border bg-background">
							<PageLayout
								breadcrumbs={[
									{ label: "Campaigns", link: "/campaigns" },
									{ label: "Spring launch" },
								]}
							>
								<div className="rounded-lg border border-dashed border-border p-4 text-body-md text-muted-foreground">
									Breadcrumb header (detail pages)
								</div>
							</PageLayout>
						</div>
						<div className="flex flex-wrap gap-4 text-label-caps text-muted-foreground">
							<span className="rounded-md bg-muted p-page">p-page</span>
							<span className="flex gap-section rounded-md bg-muted p-4">
								<span>gap-section</span>
								<span>gap-section</span>
							</span>
							<span className="flex gap-stack rounded-md bg-muted p-4">
								<span>gap-stack</span>
								<span>gap-stack</span>
							</span>
						</div>
					</Section>

					<Section title="Table card">
						<TableCard>
							<TableCardHeader
								title="Campaigns"
								description="Header with a description and actions."
								actions={<Button size="sm">New Campaign</Button>}
							/>
							<TableCardToolbar>
								<Input className="max-w-60" placeholder="Search" />
								<Button size="sm" variant="outline">
									Filter
								</Button>
							</TableCardToolbar>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>Spring launch</TableCell>
										<TableCell>
											<StatusBadge kind="campaign" status="APPROVED" />
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Summer sale</TableCell>
										<TableCell>
											<StatusBadge kind="campaign" status="DRAFT" />
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<TableCardFooter>
								<span className="text-body-md text-muted-foreground">
									1 - 2 of 2
								</span>
							</TableCardFooter>
						</TableCard>
					</Section>

					<Section title="Form section card">
						<FormSectionCard
							title="Identity"
							description="Name and Objective of the Campaign."
							footer={<Button>Save and continue</Button>}
						>
							<TextInput
								name="ds-name"
								label="Name"
								value="Spring launch"
								setValue={() => undefined}
								hint="Shown in your Campaign list."
							/>
							<TextInput
								name="ds-budget"
								label="Budget"
								value="-1"
								setValue={() => undefined}
								error="Amount must be a non-negative number."
							/>
						</FormSectionCard>
					</Section>

					<Section title="Empty state and loading">
						<div className="grid gap-stack md:grid-cols-2">
							<TableCard>
								<NoDataFound />
							</TableCard>
							<TableCard>
								<NoDataFound
									title="No Campaigns yet"
									description="Create your first Campaign to start advertising."
									action={<Button>New Campaign</Button>}
								/>
							</TableCard>
						</div>
						<TableCard>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Budget</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableSkeletonRows columns={3} rows={3} />
								</TableBody>
							</Table>
						</TableCard>
						<Row label="Confirmation dialog (extended)">
							<Button variant="outline" onClick={() => setConfirmOpen(true)}>
								Delete Campaign
							</Button>
							<ConfirmationDialog
								open={confirmOpen}
								setOpen={setConfirmOpen}
								item={null}
								title="Delete this Campaign?"
								description="This cannot be undone."
								confirmLabel="Delete"
								destructive
							/>
						</Row>
					</Section>

					<Section title="Tabs (campaign steps)">
						<Row>
							<Tab title="Identity" done />
							<Tab title="Targeting" activeTabId />
							<Tab title="Creative" />
							<Tab title="Review" disabled />
						</Row>
					</Section>

					<Section title="Overlays">
						<Row>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline">Dialog</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Dialog title</DialogTitle>
										<DialogDescription>
											A short description of what happens next.
										</DialogDescription>
									</DialogHeader>
									<Input placeholder="Focusable field" />
									<DialogFooter showCloseButton>
										<Button variant="destructive">
											<Trash2Icon />
											Delete
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline">Sheet</Button>
								</SheetTrigger>
								<SheetContent side={direction === "rtl" ? "left" : "right"}>
									<SheetHeader>
										<SheetTitle>Sheet title</SheetTitle>
										<SheetDescription>
											Side panel for secondary tasks.
										</SheetDescription>
									</SheetHeader>
									<SheetFooter>
										<Button>Apply</Button>
									</SheetFooter>
								</SheetContent>
							</Sheet>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										Dropdown menu
										<ChevronDownIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem>
										Edit
										<DropdownMenuShortcut>E</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuCheckboxItem checked>
										Checked item
									</DropdownMenuCheckboxItem>
									<DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
										<DropdownMenuSubContent>
											<DropdownMenuItem>Nested item</DropdownMenuItem>
										</DropdownMenuSubContent>
									</DropdownMenuSub>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive">
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">Popover</Button>
								</PopoverTrigger>
								<PopoverContent>
									<PopoverHeader>
										<PopoverTitle>Popover title</PopoverTitle>
										<PopoverDescription>
											Small floating surface.
										</PopoverDescription>
									</PopoverHeader>
								</PopoverContent>
							</Popover>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline">Tooltip</Button>
								</TooltipTrigger>
								<TooltipContent>Helpful hint</TooltipContent>
							</Tooltip>
						</Row>
					</Section>

					<Section title="Avatar, skeleton, separator">
						<Row label="Avatar">
							<Avatar size="sm">
								<AvatarFallback>SM</AvatarFallback>
							</Avatar>
							<Avatar>
								<AvatarFallback>AB</AvatarFallback>
								<AvatarBadge />
							</Avatar>
							<Avatar size="lg">
								<AvatarFallback>LG</AvatarFallback>
							</Avatar>
							<AvatarGroup>
								<Avatar>
									<AvatarFallback>A</AvatarFallback>
								</Avatar>
								<Avatar>
									<AvatarFallback>B</AvatarFallback>
								</Avatar>
								<AvatarGroupCount>+3</AvatarGroupCount>
							</AvatarGroup>
						</Row>
						<div className="flex flex-col gap-2">
							<p className="text-label-caps text-muted-foreground">Skeleton</p>
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-48" />
							<Skeleton className="size-12 rounded-full" />
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-label-caps text-muted-foreground">Separator</p>
							<Separator />
							<div className="flex h-6 items-center gap-3">
								<span>One</span>
								<Separator orientation="vertical" />
								<span>Two</span>
							</div>
						</div>
					</Section>

					<Section title="Calendar">
						<Card className="w-fit">
							<CardContent>
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									dir={direction}
								/>
							</CardContent>
						</Card>
					</Section>
				</main>
			</div>
		</TooltipProvider>
	);
}
