export function AccountStatusCard({ user }) {
  if (!user) return null;

  const getStatusConfig = () => {
    if (user.status === "restricted") {
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-red-600 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m4.9 4.9 14.2 14.2" />
          </svg>
        ),
        bgColor: "bg-red-50",
        title: "Account Blocked",
        titleColor: "text-red-800",
        description: "Your account has been restricted due to policy violations. Please contact support.",
        borderColor: "border-red-100",
      };
    }

    const failedOrdersCount = user.failed_orders_count || 0;

    if (failedOrdersCount > 0) {
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-amber-600 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        ),
        bgColor: "bg-amber-50",
        title: "Warning",
        titleColor: "text-amber-800",
        description: `You have ${failedOrdersCount} failed ${failedOrdersCount === 1 ? "order" : "orders"}. Please ensure payment is completed for pending orders.`,
        borderColor: "border-amber-100",
      };
    }

    return {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-green-600 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
        >
          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      ),
      bgColor: "bg-green-50",
      title: "Clean record",
      titleColor: "text-green-800",
      description: "No warnings or fraudulent activity reported",
      borderColor: "border-green-100",
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`overflow-hidden rounded-xl border ${statusConfig.borderColor} bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${statusConfig.bgColor} sm:h-14 sm:w-14 lg:h-16 lg:w-16`}>{statusConfig.icon}</div>
          <div>
            <h3 className={`text-base font-semibold ${statusConfig.titleColor} sm:text-lg`}>{statusConfig.title}</h3>
            <p className="text-xs text-gray-600 sm:text-sm">{statusConfig.description}</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-gray-400"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}
