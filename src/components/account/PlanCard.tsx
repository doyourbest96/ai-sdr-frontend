import { BillingPeriod } from "./BillingPeriod";

interface PlanCardProps {
  plan: {
    name: string;
    price: number;
    exportCredits: string;
    mobileCredits: string;
  };
  billingPeriod: BillingPeriod;
  isSelected?: boolean;
  loading?: boolean;
  processingPlan?: string;
  onUpgrade: (plan: any) => void;
}

export const PlanCard = ({
  plan,
  billingPeriod,
  isSelected = false,
  loading = false,
  processingPlan,
  onUpgrade,
}: PlanCardProps) => {
  const isProcessing = processingPlan === plan.name;

  const getPeriodLabel = () => {
    switch (billingPeriod) {
      case "monthly":
        return "month";
      case "quarterly":
        return "quarter";
      case "annually":
        return "year";
    }
  };

  return (
    <div className="h-full w-full p-4 md:p-6 flex flex-col gap-4 md:gap-5 border rounded-md shadow-lg bg-white hover:border-blue-600">
      <div className="p-4 md:p-8 flex flex-col gap-2 justify-center items-center">
        <p className="text-xl md:text-2xl font-medium">{plan.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl md:text-4xl font-semibold">
            ${plan.price}
          </span>
        </div>
        {plan.name !== "Free" ? (
          <>
            <p className="text-sm text-gray-500">Per user, per month</p>
            <p className="text-sm text-gray-500">Billed {billingPeriod}</p>
          </>
        ) : (
          <>
            <div className="h-10"></div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3 justify-center items-center text-sm md:text-base">
        <p className="text-center">{plan.exportCredits}</p>
        <p className="text-center">{plan.mobileCredits}</p>
      </div>

      {isSelected ? (
        <button
          className="w-full bg-gray-200 text-white p-2 rounded-md"
          disabled
        >
          Current Plan
        </button>
      ) : (
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          disabled={loading || isProcessing}
          onClick={() => onUpgrade(plan)}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing
            </span>
          ) : (
            "Upgrade Plan"
          )}
        </button>
      )}
    </div>
  );
};