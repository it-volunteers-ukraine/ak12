"use client";

import z from "zod";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormInput } from "../input";
import { SubmitIcon } from "../../../public/icons";
import { PolicyButton } from "../policy-modal";
import { FeedbackFormContent, getFeedbackFormSchema, IFeedbackForm, PrivacyPolicyContent } from "@/schemas";
import { cn } from "@/utils";

export const FeedbackForm = ({
  content,
  privacyPolicyContent,
  isModal,
}: {
  content: FeedbackFormContent;
  privacyPolicyContent: PrivacyPolicyContent | null;
  isModal?: boolean;
}) => {
  const errorMessages = useTranslations("validation");
  const text = useTranslations("form");

  const schema = useMemo(() => getFeedbackFormSchema(errorMessages), [errorMessages]);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
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

  const onSubmit: SubmitHandler<IFeedbackForm> = async (_data) => {
    // TODO: implement feedback form submission
    reset();
  };

  return (
    <div
      className={cn(
        "desktop:p-12 tablet:bg-card-bg tablet:p-12 tablet:border tablet:border-accent tablet:rounded-xs w-full",
        isModal && "laptop:w-212",
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tablet:gap-6 tablet:grid-cols-2 grid grid-cols-1 gap-5.5">
          <FormInput
            name="firstName"
            control={control}
            label={text("firstName")}
            placeholder={text("placeholderFirstName")}
          />
          <FormInput
            name="lastName"
            control={control}
            label={text("lastName")}
            placeholder={text("placeholderLastName")}
          />
          <FormInput
            type="email"
            name="email"
            control={control}
            label={text("email")}
            placeholder={text("placeholderEmail")}
          />
          <FormInput
            type="tel"
            name="phone"
            control={control}
            label={text("phone")}
            placeholder={text("placeholderPhone")}
          />
        </div>
        <div className="tablet:mt-8.5 tablet:gap-6 mt-7 grid gap-5.5">
          <FormInput
            as="textarea"
            control={control}
            name="description"
            classNameContainer="mt-1.5"
            label={content.descriptionInputTitle}
            placeholder={content.descriptionInputPlaceholder}
          />
          <FormInput
            as="radio"
            name="subject"
            control={control}
            classNameContainer="mt-2"
            label={content.radioButtonsTitle}
            radioOptions={content.radioButtons}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent group desktop:mt-14 desktop:mb-9 desktop:text-[20px] disabled:text-text-disabled disabled:bg-disabled hover:bg-accent/50 focus:bg-accent-hover active:bg-accent-hover font-ermilov tablet:mt-10 tablet:mb-6 mt-7 mb-4 flex w-full items-center justify-center gap-1 rounded-xs py-3 text-[18px] transition-colors"
        >
          {content.buttonSubmit}
          <SubmitIcon className="text-card-bg group-disabled:text-text-disabled h-6 w-6" />
        </button>
      </form>
      <PolicyButton
        text={content.privacyPolicyTitle}
        textLink={content.privacyPolicyTextLink}
        privacyPolicyContent={privacyPolicyContent}
      />
    </div>
  );
};
