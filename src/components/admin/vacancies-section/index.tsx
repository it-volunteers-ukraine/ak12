"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import slugify from "slugify";

import { showMessage } from "@/components/toastify";
import { ConfirmModal } from "@/components/connfirm-modal";
import { createVacancy } from "@/actions/vacancies/create-vacancy.action";
import { updateVacancy } from "@/actions/vacancies/update-vacancy.action";
import { vacancyFormBuilderConfig } from "@/lib/admin/configs/vacancy.config";
import { adminVacancySchema, AdminVacancyData, IVacancySection } from "./config";
import { BtnGroup } from "../admin-form-elements";
import { LocaleSection } from "@/lib/form-builder/components/LocaleSection";
import { FormWrapper } from "../form";
import { VacancyTypeRadio } from "./vacancy-type-select";
import { SalaryInput } from "./salary";

// ─── Form content ─────────────────────────────────────────────────────────────

const VacancyFormContent = ({
  data,
  onReset,
  onBack,
}: {
  data?: AdminVacancyData;
  onReset: () => void;
  onBack?: () => void;
}) => {
  const {
    reset,
    formState: { isValid },
  } = useFormContext();

  return (
    <>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Назад до списку
        </button>
      )}

      <BtnGroup
        isValid={isValid}
        onReset={() => {
          reset(data);
          onReset();
        }}
        submitText="Опублікувати"
        resetText="Скасувати правки"
      />

      <h2 className="mt-6 mb-1 text-lg font-semibold">{data?.uk?.id ? "Редагування вакансії" : "Нова вакансія"}</h2>
      <p className="mb-6 text-sm text-red-500">Всі поля обов'язкові*</p>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Тип вакансії</p>
        <VacancyTypeRadio name="uk.type" />
      </div>

      <div className="mb-6 max-w-sm">
        <SalaryInput nameMin="uk.salaryMin" nameMax="uk.salaryMax" label="Зарплата*" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LocaleSection section={vacancyFormBuilderConfig.sections[0]} showOutsideTitle={false} />
      </div>
    </>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────

export const VacancySection = ({ data, onSuccess, onBack }: IVacancySection) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<AdminVacancyData | null>(null);

  const handleSubmit = async (values: AdminVacancyData) => {
    try {
      const generateSlug = (position: string) => slugify(position, { lower: true, strict: true });

      if (data?.uk?.id && data?.en?.id) {
        await updateVacancy({
          ukId: data.uk.id,
          enId: data.en.id,
          type: values.uk.type!,
          salaryMin: values.uk.salaryMin!,
          salaryMax: values.uk.salaryMax ?? undefined,
          uk: {
            position: values.uk.position,
            slug: data.uk.slug ?? generateSlug(values.uk.position),
            description: values.uk.description,
          },
          en: {
            position: values.en.position,
            slug: data.en.slug ?? generateSlug(values.uk.position),
            description: values.en.description,
          },
        });
      } else {
        await createVacancy({
          type: values.uk.type!,
          salaryMin: values.uk.salaryMin!,
          salaryMax: values.uk.salaryMax ?? undefined,
          uk: {
            position: values.uk.position,
            description: values.uk.description,
          },
          en: {
            position: values.en.position,
            description: values.en.description,
          },
        });
      }

      showMessage.success("Дані успішно збережено!");
      onSuccess?.();
      router.refresh();
      return { success: true };
    } catch (error) {
      showMessage.error("Не вдалося зберегти дані");
      return { success: false, error: String(error) };
    }
  };

  const onFormSubmit = (values: AdminVacancyData) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (!pendingData) return;
    setIsLoading(true);
    handleSubmit(pendingData).finally(() => {
      setIsLoading(false);
      setPendingData(null);
    });
  };

  const empty = {
    position: "",
    slug: "",
    description: "",
    type: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    isActive: true,
    sortOrder: 0,
  };

  const formData: AdminVacancyData = data
    ? {
        uk: { ...data.uk, slug: data.uk.slug ?? "" }, // ← null → ""
        en: { ...data.en, slug: data.en.slug ?? "" }, // ← null → ""
      }
    : { uk: empty, en: empty };

  return (
    <>
      <FormWrapper<AdminVacancyData>
        schema={adminVacancySchema}
        initialValues={formData}
        onSubmit={onFormSubmit}
        key={data?.uk?.id || "vacancy-new"}
      >
        <VacancyFormContent data={formData} onBack={onBack} onReset={() => {}} />
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        handleConfirm={handleConfirm}
        title="Підтвердіть зміни"
        content="Ви впевнені, що хочете зберегти зміни?"
      />
    </>
  );
};
