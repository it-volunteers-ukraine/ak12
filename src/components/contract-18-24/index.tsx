"use client";

import { useMemo, useRef, useState } from "react";

import { Menu } from "./menu";
import { Title } from "./title";
import { Contract } from "./contract";
import { Transfer } from "./transfer";
import { SECTION_KEYS } from "@/constants";
import { Mobilization } from "./mobilization";
import { ApplyButton } from "../vacancies/ApplyButton";
import {
  TransferContent,
  Contract1824Content,
  FeedbackFormContent,
  MobilizationContent,
  PrivacyPolicyContent,
  FeedbackFormContentWithMessage,
} from "@/schemas";
import { useTopFromViewportMinusContent } from "@/hooks/useTopFromViewportMinusContent";

export type BlockListItem =
  | typeof SECTION_KEYS.TRANSFER
  | typeof SECTION_KEYS.MOBILIZATION
  | typeof SECTION_KEYS.CONTRACT_18_24;

interface JoinUsSectionProps {
  contentJoinUs: {
    transfer: TransferContent | null;
    mobilization: MobilizationContent | null;
    contract1824: Contract1824Content | null;
  };
  contentModal: FeedbackFormContent | null;
  privacyPolicyContent: PrivacyPolicyContent | null;
}

export const JoinUsSection = ({ contentJoinUs, contentModal, privacyPolicyContent }: JoinUsSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const top = useTopFromViewportMinusContent(sectionRef);

  const sections = useMemo(() => {
    return {
      [SECTION_KEYS.MOBILIZATION]: contentJoinUs.mobilization
        ? {
            key: SECTION_KEYS.MOBILIZATION as BlockListItem,
            content: contentJoinUs.mobilization.baseSection,
            render: (buttonComponent: React.ReactNode) => (
              <Mobilization content={contentJoinUs.mobilization!} buttonComponent={buttonComponent} />
            ),
          }
        : null,

      [SECTION_KEYS.CONTRACT_18_24]: contentJoinUs.contract1824
        ? {
            key: SECTION_KEYS.CONTRACT_18_24 as BlockListItem,
            content: contentJoinUs.contract1824.baseSection,
            render: (buttonComponent: React.ReactNode) => (
              <Contract content={contentJoinUs.contract1824!} buttonComponent={buttonComponent} />
            ),
          }
        : null,

      [SECTION_KEYS.TRANSFER]: contentJoinUs.transfer
        ? {
            key: SECTION_KEYS.TRANSFER as BlockListItem,
            content: contentJoinUs.transfer.baseSection,
            render: (buttonComponent: React.ReactNode) => (
              <Transfer content={contentJoinUs.transfer!} buttonComponent={buttonComponent} />
            ),
          }
        : null,
    };
  }, [contentJoinUs]);

  const availableSections = useMemo(() => Object.values(sections).filter(Boolean), [sections]);

  const blockList = useMemo(
    () =>
      availableSections.map((section) => ({
        label: section!.content.menuButton,
        value: section!.key,
      })),
    [availableSections],
  );

  const [activeBlock, setActiveBlock] = useState<BlockListItem | null>(blockList[0]?.value || null);

  const activeSection = activeBlock ? sections[activeBlock] : null;

  if (!activeBlock || !activeSection || blockList.length === 0) {
    return null;
  }

  const contentModalWithMessage: FeedbackFormContentWithMessage | null = contentModal
    ? {
        ...contentModal,
        message: activeSection.content.message,
      }
    : null;

  const buttonComponent = (
    <ApplyButton
      contentModal={contentModalWithMessage}
      privacyPolicyContent={privacyPolicyContent}
      className="text-soft-blush relative z-1 h-10"
      textButton={activeSection.content.buttonJoinUs}
    />
  );

  return (
    <section
      ref={sectionRef}
      style={{
        top,
      }}
      id="join"
      className="bg-section tablet:pb-25 desktop:pb-29 desktop-xl:pb-40 sticky pb-16"
    >
      <Title title={activeSection.content.sectionTitle} subTitle={activeSection.content.sectionSubtitle} />
      <Menu activeBlock={activeBlock} blockList={blockList} onChangeBlock={setActiveBlock} />
      {activeSection.render(buttonComponent)}
    </section>
  );
};
