import moment from "moment";
import Bag from "../../assets/svg/iconmonstr-briefcase-thin (1).svg";

interface Iprops {
	label: string;
	amount: number;
	date: string | undefined;
	editable?: boolean;
	isEditing?: boolean;
	onEdit?: () => void;
	onChange?: (value: number) => void;
	onSave?: () => void;
}
export default function Revenue({ label, amount, date, editable, isEditing, onEdit, onChange, onSave }: Iprops) {
	return (
		<div className="grid grid-cols-1  items-start justify-items-start">
			<h3 className="flex items-center gap-2">
				<div className="w-8 h-8 bg-blue-50 rounded-full flex justify-center items-center">
					<img src={Bag} alt="Bag Icon" className="h-4 w-4" />
				</div>
				<span className="text-xs text-gray-600 font-bold ">{label}</span>
			</h3>
			<div className="flex items-center gap-2">
				{isEditing ? (
					<input
						type="number"
						value={amount}
						onChange={(e) => onChange && onChange(parseFloat(e.target.value))}
						onBlur={onSave}
						onKeyDown={(e) => e.key === 'Enter' && onSave && onSave()}
						className="font-extrabold text-lg tracking-wider border rounded px-1"
					/>
				) : (
					<h2 className="font-extrabold text-lg tracking-wider">KES {amount.toFixed(4)}</h2>
				)}
				{editable && !isEditing && <span onClick={onEdit} className="cursor-pointer text-gray-500">✏️</span>}
			</div>
			<h3 className="font-light text-xs text-gray-500 mt-1">
				{date ?? moment().subtract(1, "days").format("DD-MM-YYYY")}
			</h3>
		</div>
	);
}
