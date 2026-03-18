/* import { getHeaderContentByLocale, saveHeaderAction } from "@/actions/header";
import { HeaderContent } from "@/components/Header";
import { Locale } from "@/types";

type HeaderFormProps = {
	locale: Locale;
	content: HeaderContent | null;
};

const HeaderForm = ({ locale, content }: HeaderFormProps) => {
	const link1 = content?.links[0];
	const link2 = content?.links[1];
	const link3 = content?.links[2];

	return (
		<form
			action={saveHeaderAction}
			className="rounded-lg border border-neutral-200 bg-white p-6"
		>
			<input type="hidden" name="locale" value={locale} />

			<h2 className="mb-4 text-xl font-semibold">
				Header ({locale.toUpperCase()})
			</h2>

			<div className="mb-4 grid gap-3">
				<label className="grid gap-1">
					<span className="text-sm text-neutral-600">Logo text</span>
					<input
						required
						name="logoText"
						defaultValue={content?.logoText ?? ""}
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
				</label>
			</div>

			<div className="mb-6 grid gap-3">
				<p className="text-sm font-medium text-neutral-700">Navigation links</p>

				<div className="grid gap-2 md:grid-cols-2">
					<input
						name="link1Label"
						required
						defaultValue={link1?.label ?? ""}
						placeholder="Link 1 label"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
					<input
						name="link1Href"
						required
						defaultValue={link1?.href ?? ""}
						placeholder="/vacancies"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
				</div>

				<div className="grid gap-2 md:grid-cols-2">
					<input
						name="link2Label"
						required
						defaultValue={link2?.label ?? ""}
						placeholder="Link 2 label"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
					<input
						name="link2Href"
						required
						defaultValue={link2?.href ?? ""}
						placeholder="/subdivisions"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
				</div>

				<div className="grid gap-2 md:grid-cols-2">
					<input
						name="link3Label"
						defaultValue={link3?.label ?? ""}
						placeholder="Link 3 label"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
					<input
						name="link3Href"
						defaultValue={link3?.href ?? ""}
						placeholder="/contacts"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
				</div>
			</div>

			<div className="mb-6 grid gap-3">
				<p className="text-sm font-medium text-neutral-700">CTA button</p>
				<div className="grid gap-2 md:grid-cols-2">
					<input
						required
						name="ctaLabel"
						defaultValue={content?.cta.label ?? ""}
						placeholder="Apply now"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
					<input
						required
						name="ctaHref"
						defaultValue={content?.cta.href ?? ""}
						placeholder="/apply"
						className="h-10 rounded-md border border-neutral-300 px-3"
					/>
				</div>
			</div>

			<button
				type="submit"
				className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
			>
				Save {locale.toUpperCase()} header
			</button>
		</form>
	);
};

export default async function AdminPage() {
	const [ukContent, enContent] = await Promise.all([
		getHeaderContentByLocale("uk"),
		getHeaderContentByLocale("en"),
	]);

	return (
		<main className="mx-auto max-w-5xl p-6">
			<h1 className="mb-2 text-3xl font-bold">Header content admin</h1>
			<p className="mb-8 text-sm text-neutral-600">
				Manage localized header content for both languages.
			</p>

			<div className="grid gap-6">
				<HeaderForm locale="uk" content={ukContent} />
				<HeaderForm locale="en" content={enContent} />
			</div>
		</main>
	);
} */

export default function AdminPage() {
	return (
		<main className="mx-auto max-w-5xl p-6">
			<h1 className="text-3xl font-bold">Admin example</h1>
			<p className="mt-2 text-sm text-neutral-600">
				The implementation is intentionally left in comments as an example.
			</p>
		</main>
	);
}