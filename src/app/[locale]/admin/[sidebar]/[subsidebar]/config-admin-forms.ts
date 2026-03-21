import HeaderContent from "@/components/admin/contacts/header";

type TAdminFormComponent = () => Promise<React.JSX.Element> | React.JSX.Element;

export const FORM_COMPONENTS: Record<string, TAdminFormComponent> = {
    ceo1: HeaderContent,
    header: HeaderContent,
    footer: HeaderContent,
    openings: HeaderContent,
};
