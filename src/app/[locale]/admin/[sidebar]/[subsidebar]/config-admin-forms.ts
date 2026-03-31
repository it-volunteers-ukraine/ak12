import { HeroSchema } from "@/schemas/heroContent";
import { HeroSection } from "@/components/admin/hero-section";

interface TAdminData {
  en: HeroSchema | null;
  uk: HeroSchema | null;
}
export interface IAdminFormProps {
  data: TAdminData;
}
type TAdminFormComponent = React.ComponentType<IAdminFormProps>;

export const FORM_COMPONENTS: Record<string, TAdminFormComponent> = {
  hero: HeroSection,
};
