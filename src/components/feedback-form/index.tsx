"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormInput } from "../input";
import { SubmitIcon } from "../../../public/icons";
import { PolicyButton } from "../policy-modal/indedx";
import { FeedbackFormContent, getFeedbackFormSchema, IFeedbackForm } from "@/schemas";

export const FeedbackForm = ({ content }: { content: FeedbackFormContent }) => {
  const errorMessages = useTranslations("validation");
  const text = useTranslations("form");

  const schema = useMemo(() => getFeedbackFormSchema(errorMessages), [errorMessages]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFeedbackForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<IFeedbackForm> = async (data) => {
    //TODO  await відправка даних на email
    console.log("Відправлено:", data);
  };

  return (
    <div className="bg-dark-green border-accent w-full rounded-xs border p-12">
      <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8.5 flex flex-col gap-5.5">
          <div className="flex gap-6">
            <FormInput label={text("firstName")} placeholder={text("firstName")} name="firstName" control={control} />
            <FormInput label={text("lastName")} placeholder={text("lastName")} name="lastName" control={control} />
          </div>
          <div className="flex gap-6">
            <FormInput type="email" label={text("email")} placeholder={text("email")} name="email" control={control} />
            <FormInput type="tel" label={text("phone")} placeholder={text("phone")} name="phone" control={control} />
          </div>
        </div>
        <FormInput
          classNameContainer="mb-6"
          control={control}
          name="description"
          label={content.descriptionInputTitle}
          as="textarea"
          placeholder={content.descriptionInputPlaceholder}
        />
        <FormInput
          name="subject"
          control={control}
          as="radio"
          label={content.radioButtonsTitle}
          radioOptions={content.radioButtons}
        />

        <button
          disabled={isSubmitting}
          className="bg-accent group disabled:text-text-disabled disabled:bg-disabled hover:bg-accent/50 focus:bg-accent-hover active:bg-accent-hover font-ermilov mt-10 flex w-full items-center justify-center gap-1 rounded-xs py-3 text-[20px] transition-colors"
          type="submit"
        >
          {content.buttonSubmit}
          <SubmitIcon className="text-card-bg group-disabled:text-text-disabled h-6 w-6" />
        </button>
      </form>
      <PolicyButton text={content.privacyPolicyTitle} textLink={content.privacyPolicyTextLink} />
    </div>
  );
};
