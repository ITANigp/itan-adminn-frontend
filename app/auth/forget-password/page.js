import { Suspense } from "react";
import ForgetPassword from "./ForgetPassword";

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-lg">Loading confirmation...</p>
        </div>
      }
    >
      <ForgetPassword />
    </Suspense>
  );
}
