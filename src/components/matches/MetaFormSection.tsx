import { AGE_GROUPS, WEIGHT_CLASSES, RINGS, RULE_TYPES } from '../../constants/matchOptions'

type MetaFormSectionProps = {
  ruleType: string
  gender: string
  ageGroup: string
  weightClass: string
  ring: string
  notes: string
  onRuleTypeChange: (value: string) => void
  onGenderChange: (value: string) => void
  onAgeGroupChange: (value: string) => void
  onWeightClassChange: (value: string) => void
  onRingChange: (value: string) => void
  onNotesChange: (value: string) => void
}

export const MetaFormSection = ({
  ruleType,
  gender,
  ageGroup,
  weightClass,
  ring,
  notes,
  onRuleTypeChange,
  onGenderChange,
  onAgeGroupChange,
  onWeightClassChange,
  onRingChange,
  onNotesChange,
}: MetaFormSectionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rule Type
          </label>
          <select
            value={ruleType}
            onChange={(e) => onRuleTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Rule Type</option>
            {RULE_TYPES.map(rule => (
              <option key={rule} value={rule}>
                {rule}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Group
          </label>
          <select
            value={ageGroup}
            onChange={(e) => onAgeGroupChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Age Group</option>
            {AGE_GROUPS.map(age => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        {/* Weight Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight Class
          </label>
          <select
            value={weightClass}
            onChange={(e) => onWeightClassChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Weight Class</option>
            {WEIGHT_CLASSES.map(weight => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>

        {/* Ring */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ring
          </label>
          <select
            value={ring}
            onChange={(e) => onRingChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Ring</option>
            {RINGS.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            placeholder="Additional notes or comments"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
