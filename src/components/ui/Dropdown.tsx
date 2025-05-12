import React from "react";

interface DropdownProps {
	label: string;
	value: number;
	options: number[];
	onChange: (value: number) => void;
	className?: string;
	optionSuffix?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
	label,
	value,
	options,
	onChange,
	className = "",
	optionSuffix = "",
}) => {
	return (
		<div className="flex justify-between items-center">
			<div className="text-3xl font-semibold text-white">{label}</div>
			<select
				className={`bg-white text-black rounded-lg h-12 text-center text-2xl ${className}`}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				required
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
						{optionSuffix}
					</option>
				))}
			</select>
		</div>
	);
};
