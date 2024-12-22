"use client";
import { Range } from "@/components/Range";
import { MockOneApi } from "api/ExampleOne";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [sliderValueOne, setSliderValueOne] = useState({ min: 0, max: 1 });

  const handleMockOneApi = async () => {
    setLoading(true);
    const response = await MockOneApi().then((response) => response);
    setTimeout(() => {
      setSliderValueOne(response);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleMockOneApi();
  }, []);

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      {JSON.stringify(sliderValueOne)}
      <Range
        min={sliderValueOne.min}
        max={sliderValueOne.max}
        loading={loading}
      />
    </div>
  );
}
