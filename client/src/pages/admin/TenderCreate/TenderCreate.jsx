import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { tenderService } from "../../../services/tenderService";
import Stepper from "./components/Stepper";
import StepBasicInfo from "./components/StepBasicInfo";
import StepContentBuilder from "./components/StepContentBuilder";
import StepReviewPublish from "./components/StepReviewPublish";

const STEPS = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Content Builder" },
  { id: 3, label: "Review & Publish" },
];

export default function TenderCreate() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [tenderDraft, setTenderDraft] = useState({
    basicInfo: {},
    sections: [],
    metadata: {},
  });
  const [tenderId, setTenderId] = useState(null);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [published, setPublished] = useState(false);

  const handleNext = async () => {
    if (currentStep < STEPS.length && isStepValid) {
      setError(null);
      setIsSaving(true);
      try {
        if (currentStep === 1) {
          // Step 1: Create tender draft
          const created = await tenderService.createTender(
            {
              title: tenderDraft.basicInfo.title,
              description: tenderDraft.basicInfo.description,
              submission_deadline: tenderDraft.basicInfo.submissionDeadline,
            },
            token
          );
          setTenderId(created.tender_id);
        } else if (currentStep === 2 && tenderId) {
          // Step 2: Add/update sections and mark them as saved
          for (const section of tenderDraft.sections) {
            if (!section.section_id && !section._saved) {
              const created = await tenderService.addSection(
                tenderId,
                { title: section.title, is_mandatory: section.mandatory },
                token
              );
              section.section_id = created.section_id;
              section._saved = true;
            } else if (section._updated) {
              await tenderService.updateSection(
                section.section_id,
                { title: section.title, is_mandatory: section.mandatory },
                token
              );
              section._updated = false;
            }
          }
        }
        setCurrentStep(currentStep + 1);
        setIsStepValid(false);
      } catch (err) {
        setError(err.message || "Failed to save");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !published) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (!tenderId) return;
    setError(null);
    setIsSaving(true);
    try {
      // Ensure all sections are saved before publishing
      for (const section of tenderDraft.sections) {
        if (!section.section_id && !section._saved) {
          const created = await tenderService.addSection(
            tenderId,
            { title: section.title, is_mandatory: section.mandatory },
            token
          );
          section.section_id = created.section_id;
          section._saved = true;
        } else if (section._updated) {
          await tenderService.updateSection(
            section.section_id,
            { title: section.title, is_mandatory: section.mandatory },
            token
          );
          section._updated = false;
        }
      }
      
      await tenderService.publishTender(tenderId, token);
      setPublished(true);
      // Redirect to dashboard after short delay
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.message || "Failed to publish");
    } finally {
      setIsSaving(false);
    }
  };

  const updateTenderDraft = (field, value) => {
    setTenderDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            data={tenderDraft.basicInfo}
            onUpdate={(data) => updateTenderDraft("basicInfo", data)}
            onValidationChange={setIsStepValid}
          />
        );
      case 2:
        return (
          <StepContentBuilder
            data={tenderDraft.sections}
            onUpdate={(data) => updateTenderDraft("sections", data)}
            onValidationChange={setIsStepValid}
            tenderMetadata={tenderDraft.basicInfo}
          />
        );
      case 3:
        return (
          <StepReviewPublish
            data={tenderDraft}
            onUpdate={updateTenderDraft}
            onValidationChange={setIsStepValid}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Create New Tender
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Follow the steps to create and publish your tender
          </p>
        </div>

        {/* Stepper */}
        <div className="px-8 pb-6">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          {published && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Tender published successfully!
            </div>
          )}
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="border-t border-neutral-200 bg-white sticky bottom-0">
        <div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || published || isSaving}
            className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              Step {currentStep} of {STEPS.length}
            </span>
            {currentStep === STEPS.length ? (
              <button
                onClick={handlePublish}
                disabled={!tenderId || published || isSaving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Publishing..." : "Publish Tender"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid || isSaving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
