import { Locale } from "@/types";
import { HeroSchema } from "@/schema/heroSchema";
import { HeroSection } from "@/components/admin/hero-section";
import HeaderContent from "@/components/admin/contacts/header";

type TAdminData = HeroSchema | null;
export interface IAdminFormProps {
    locale: Locale;
    data: TAdminData;
}
type TAdminFormComponent = React.ComponentType<IAdminFormProps>;

export const FORM_COMPONENTS: Record<string, TAdminFormComponent> = {
    hero: HeroSection,
    mobilization: HeaderContent,
    contract: HeaderContent,
    transfer: HeaderContent,
};
