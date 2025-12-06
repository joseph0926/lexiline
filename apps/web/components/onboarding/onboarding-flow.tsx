"use client";

import { useState, useActionState } from "react";
import { AnimatePresence } from "motion/react";
import { WelcomeStep } from "./steps/welcome-step";
import { SmokingAmountStep } from "./steps/smoking-amount-step";
import { TargetIntervalStep } from "./steps/target-interval-step";
import { MotivationStep } from "./steps/motivation-step";
import { StepIndicator } from "./step-indicator";
import { completeOnboarding, type OnboardingActionState } from "@/actions/onboarding";
import { DailySmokingRange } from "@/prisma/generated/prisma/enums";

export interface OnboardingData {
	dailySmokingRange: DailySmokingRange | null;
	targetInterval: number;
	motivation: string;
}

const STEPS = ["welcome", "smoking-amount", "target-interval", "motivation"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingFlow() {
	const [currentStep, setCurrentStep] = useState<Step>("welcome");
	const [data, setData] = useState<OnboardingData>({
		dailySmokingRange: null,
		targetInterval: 60,
		motivation: "",
	});

	const [state, formAction, isPending] = useActionState<OnboardingActionState | null, FormData>(
		completeOnboarding,
		null,
	);

	const stepIndex = STEPS.indexOf(currentStep);
	const isFirstStep = stepIndex === 0;
	const isLastStep = stepIndex === STEPS.length - 1;

	const goNext = () => {
		if (!isLastStep) {
			setCurrentStep(STEPS[stepIndex + 1]);
		}
	};

	const goPrev = () => {
		if (!isFirstStep) {
			setCurrentStep(STEPS[stepIndex - 1]);
		}
	};

	const updateData = (partial: Partial<OnboardingData>) => {
		setData((prev) => ({ ...prev, ...partial }));
	};

	return (
		<div className="flex min-h-dvh flex-col">
			{currentStep !== "welcome" && (
				<div className="px-6 pt-6">
					<StepIndicator current={stepIndex - 1} total={STEPS.length - 1} />
				</div>
			)}
			<div className="flex flex-1 flex-col">
				<AnimatePresence mode="wait">
					{currentStep === "welcome" && <WelcomeStep key="welcome" onNext={goNext} />}
					{currentStep === "smoking-amount" && (
						<SmokingAmountStep
							key="smoking-amount"
							value={data.dailySmokingRange}
							onChange={(value) => updateData({ dailySmokingRange: value })}
							onNext={goNext}
							onPrev={goPrev}
						/>
					)}
					{currentStep === "target-interval" && (
						<TargetIntervalStep
							key="target-interval"
							value={data.targetInterval}
							smokingRange={data.dailySmokingRange}
							onChange={(value) => updateData({ targetInterval: value })}
							onNext={goNext}
							onPrev={goPrev}
						/>
					)}
					{currentStep === "motivation" && (
						<MotivationStep
							key="motivation"
							value={data.motivation}
							onChange={(value) => updateData({ motivation: value })}
							formAction={formAction}
							isPending={isPending}
							error={state?.error}
							onboardingData={data}
							onPrev={goPrev}
						/>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
