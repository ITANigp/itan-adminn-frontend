import { Suspense } from "react";
import ConfirmEmailContent from "./ConfirmEmailContent";

export default function ConfirmPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-screen flex justify-center items-center">
            <p className="text-lg">Processing confirmation...</p>
          </div>
        }
      >
        <ConfirmEmailContent />
      </Suspense>
      <h2>Email verified successfully</h2>
    </div>
  );
}
