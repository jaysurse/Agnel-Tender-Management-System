import { useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/shared/PageHeader";

export default function TenderCreate() {
  const [params, setParams] = useSearchParams();
  const step = Number(params.get("step") || 1);

  const setStep = (s) => {
    params.set("step", String(s));
    setParams(params, { replace: true });
  };

  return (
    <div className="px-6 py-6 mx-auto max-w-5xl">
      <PageHeader
        title="Create Tender"
        description="Draft your tender in clear, structured steps."
      />

      {/* Steps */}
      <div className="bg-white border border-neutral-200 rounded-lg">
        <div className="flex items-center gap-2 p-2 border-b border-neutral-200">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                step === s
                  ? "bg-primary-600 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Step {s}
            </button>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="text-sm text-neutral-700">
              Step 1: Basic Info — title, organization, and key dates.
            </div>
          )}
          {step === 2 && (
            <div className="text-sm text-neutral-700">
              Step 2: Sections — build tender content using templates.
            </div>
          )}
          {step === 3 && (
            <div className="text-sm text-neutral-700">
              Step 3: Review & Publish — finalize and lock tender.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
