
import { PaymentSecurityCard } from "./PaymentSecurityCard";
import { EscrowInfoCard } from "./EscrowInfoCard";

export const PaymentInfo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PaymentSecurityCard />
      <EscrowInfoCard />
    </div>
  );
};
