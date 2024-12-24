"use client";
import { Range } from "@/components/Range";
import { useSimulatedData } from "hooks/useSimulatedData";

export default function Page() {
  const { range, isLoading } = useSimulatedData({});
  // const { arrayRanges, isLoading: isLoadingArray } = useGetDataRanges();

  // Show array from request
  // console.log({ arrayRanges, isLoadingArray });

  return (
    <div>
      <h1 className="title">Mango Range Aplication</h1>

      <h3 className="subtitle">Normal Mode:</h3>
      <Range min={range?.min} max={range?.max} loading={isLoading} />

      <h3 className="subtitle">Fixed Mode:</h3>
      <Range min={10} max={20} />
    </div>
  );
}
