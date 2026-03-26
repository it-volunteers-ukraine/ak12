import { Locale } from "@/types";
import Input from "@/components/input";
import { HeaderContent } from "@/actions/header";

export type HeaderFormProps = {
    locale: Locale;
    content: HeaderContent | null;
};

export const HeaderForm = ({ locale, content }: HeaderFormProps) => {
    return (
        <form className="rounded-lg border border-neutral-200 bg-white p-6">
            <input
                type="hidden"
                name="locale"
                value={locale}
            />

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
                <p className="text-sm font-medium text-neutral-700">
                    Navigation links
                </p>
                {content?.links.map((link, index) => (
                    <div
                        key={index}
                        className="grid gap-2 md:grid-cols-2"
                    >
                        <Input
                            name={`link${index + 1}Label`}
                            required
                            defaultValue={link.label ?? ""}
                        />
                    </div>
                ))}
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
