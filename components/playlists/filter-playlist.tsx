
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const FilterPlace = () => {
  return (
    <RadioGroup defaultValue="comfortable" className="flex space-x-2 items-center justify-center">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">R.Ratio</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="a.time" id="r2" />
        <Label htmlFor="r2">A.time</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Amount</Label>
      </div>
    </RadioGroup>
  )
}
