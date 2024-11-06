"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter, useSearchParams } from "next/navigation";

export const FilterPlace = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || ("amount") || "ratio";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("filter", value);
    router.push(`?${params.toString()}`);
  };


  return (
    <RadioGroup defaultValue="ratio" className="flex space-x-2 items-center justify-center" onValueChange={(value) => handleValueChange(value)}
    >
      <div className="flex items-center space-x-2" >
        <RadioGroupItem value="ratio" id="r1" />
        <Label htmlFor="r1">Ratio</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="playtime" id="r2" />
        <Label htmlFor="r2">play time</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="date" id="r3" />
        <Label htmlFor="r3">Date Added</Label>
      </div>
    </RadioGroup >
  )
}
