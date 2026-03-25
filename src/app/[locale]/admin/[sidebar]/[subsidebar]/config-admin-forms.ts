import HeaderContent from "@/components/admin/contacts/header";

type TAdminFormComponent = () => Promise<React.JSX.Element> | React.JSX.Element;

export const FORM_COMPONENTS: Record<string, TAdminFormComponent> = {
    banner: HeaderContent,
    mobilization: HeaderContent,
    contract: HeaderContent,
    transfer: HeaderContent,
};
