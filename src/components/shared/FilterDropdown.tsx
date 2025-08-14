import Select from "../form/Select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = ""
}: FilterDropdownProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <Select
        options={options}
        onChange={onChange}
        defaultValue={value}
      />
    </div>
  );
}
