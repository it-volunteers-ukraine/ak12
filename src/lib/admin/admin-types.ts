import z, { ZodType } from "zod";

import { SectionKey } from "@/constants";

import { ADMIN_SCHEMAS } from "./admin-schemas";

export type AdminDataMap = {
  [K in keyof typeof ADMIN_SCHEMAS]: z.infer<(typeof ADMIN_SCHEMAS)[K]>;
};

export type AdminSectionKey = keyof AdminDataMap;

export interface IAdminFormProps<K extends AdminSectionKey> {
  data: AdminDataMap[K];
}

export type TAdminFormComponent<K extends AdminSectionKey> = React.ComponentType<IAdminFormProps<K>>;

export interface IAdminSectionConfig<K extends AdminSectionKey> {
  label: string;
  sectionKey: SectionKey;
  component: TAdminFormComponent<K>;
  schema: ZodType<AdminDataMap[K]["uk"]>;
};

export const isAdminSectionKey = (value: string): value is AdminSectionKey => value in ADMIN_SCHEMAS;
