import moment from "moment";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { handlePnrUpload } from "../../Api/api";
import { NewTaxInfo, TaxInfo } from "../../Models/api";
import Money from "../../assets/svg/iconmonstr-banknote-thin.svg";
import Revenue from "./Revenue";

interface Iprops {
	data: NewTaxInfo;
	close: () => void;
}
export default function ConfirmDetails({ data, close }: Iprops) {
	const [loading, setLoading] = useState<boolean>(false);
	const [confirm, setConfirm] = useState<boolean>(false);
	const [payExcise, setPayExcise] = useState<boolean>(true);
	const [payWHT, setPayWHT] = useState<boolean>(true);
	const [exciseAmount, setExciseAmount] = useState<number>(data.deposit.total_amount * 0.05);
	const [isEditingExcise, setIsEditingExcise] = useState<boolean>(false);
	const [withholdingAmount, setWithholdingAmount] = useState<number>(data.withdrawal.total_amount * 0.05);
	const [isEditingWithholding, setIsEditingWithholding] = useState<boolean>(false);
	const [amount, setAmount] = useState<number>(exciseAmount + withholdingAmount);

	useEffect(() => {
		setAmount(exciseAmount + withholdingAmount);
	}, [exciseAmount, withholdingAmount]);


	const notify = (msg: string) => toast(msg);

	const handlePay = async () => {
		setLoading(true);
		try {
			let res = await handlePnrUpload({
				forDate: data.periodTo,
				payExcise: payExcise,
				payWHT: payWHT,
				amount: amount,
			});

			if (res.data.success) {
				setLoading(false);
				notify("Payment Sent Successfully");
				close();
			}
		} catch (error: any) {
			setLoading(false);
			notify("Error while sending payment" + " " + error.message);
		}
	};
	return (
		<div className="grid grid-cols-1 gap-8 justify-items-center">
			<div className="border-b border-dashed border-gray-400 pb-8 w-full">
				<div className="flex gap-2 items-center">
					<div className="h-16 w-16 bg-red-300 rounded-full flex items-center justify-center">
						<img src={Money} alt="Money Paid" className="h-8 " />
					</div>
					<h1 className="text-xs grid grid-cols-1 gap-1">
						<span className="text-xl font-extrabold">
							{" "}
							KES. {amount.toFixed(4)}
						</span>
						<span className="text-xs text-gray-500">
							Amount Payable from{" "}
							{data.periodFrom ??
								moment().subtract(1, "days").format("DD-MM-YYYY")}{" "}
							to {data.periodTo ?? moment().format("DD-MM-YYYY")}
						</span>
					</h1>
				</div>
			</div>
			<div className="flex gap-8 pb-8 border-b border-dashed border-gray-400 w-full">
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						name="payExcise"
						id=""
						checked={payExcise}
						// onChange={() => {
						//   setPayExcise(!payExcise);
						//   setAmount(
						//     payExcise == true
						//       ? data.totalWithholding + data.totalExcise
						//       : data.totalWithholding
						//   );
						// }}
						className="h-6 mt-1 w-6 py-2 px-2 rounded"
					/>
					<Revenue
						amount={exciseAmount}
						label="Total Exercise"
						date={
							data.periodFrom ??
							moment().subtract(1, "days").format("DD-MM-YYYY")
						}
						editable={true}
						isEditing={isEditingExcise}
						onEdit={() => setIsEditingExcise(true)}
						onChange={setExciseAmount}
						onSave={() => setIsEditingExcise(false)}
					/>
				</div>
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						name="payWHT"
						id=""
						checked={payWHT}
						// onChange={() => {
						//   setPayWHT(!payWHT);
						//   setAmount(
						//     payWHT == true
						//       ? data.totalWithholding + data.totalExcise
						//       : data.totalExcise
						//   );
						// }}
						className="h-6 w-6 py-2 mt-1 px-2 rounded"
					/>
					<Revenue
						amount={withholdingAmount}
						label="Total Withholding"
						date={
							data.periodFrom ??
							moment().subtract(1, "days").format("DD-MM-YYYY")
						}
						editable={true}
						isEditing={isEditingWithholding}
						onEdit={() => setIsEditingWithholding(true)}
						onChange={setWithholdingAmount}
						onSave={() => setIsEditingWithholding(false)}
					/>
				</div>
			</div>
			<div className="flex items-center gap-2 w-full">
				<input
					type="checkbox"
					name="confirm"
					id=""
					checked={confirm}
					className="h-6 w-6 py-2 mt-1 px-2 rounded"
					onChange={() => {
						setConfirm(!confirm);
					}}
				/>
				<label htmlFor="confirm" className="text-xs text-gray-500">
					I confirm that the above details are correct
				</label>
			</div>
			<button
				disabled={confirm && amount > 1}
				onClick={handlePay}
				className={
					confirm && amount > 1
						? "bg-secondary px-12 py-2 w-40 rounded cursor-pointer text-white font-bold"
						: " bg-gray-300 px-12 py-2 w-40 rounded cursor-not-allowed"
				}
			>
				<span className="text-base text-white ">Pay</span>
			</button>
			<button className={" w-32 py-2  rounded"} onClick={close}>
				<span className=" -mt-2 text-secondary">Cancel</span>
			</button>
		</div>
	);
}
