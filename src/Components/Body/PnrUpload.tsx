import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { handleGetPnrStatus, handlePnrUpload } from "../../Api/api";
import { NewTaxInfo, TaxInfo } from "../../Models/api";
import Money from "../../assets/svg/iconmonstr-banknote-thin.svg";
import Cross from "../../assets/svg/iconmonstr-x-mark-circle-filled.svg";
import Loader from "../Layout/Loader";
import ConfirmDetails from "../pnr/ConfirmDetails";
import Revenue from "../pnr/Revenue";

export default function PnrUpload() {
	const [loading, setLoading] = useState<boolean>(false);
	const [gridApi, setGridApi] = useState(null);
	const [date, setDate] = useState<string>();
	const [modalIsOpen, setIsOpen] = useState(false);
	const [dataTable, setDataTable] = useState<string>("stakes");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const notify = (msg: string) => toast(msg);
	const onsubmit = (data: any) => {
		setLoading(true);
		handlePnrUpload(data)
			.then((res) => {
				setLoading(false);
				notify("Report added successfully");
			})
			.catch((err: any) => {
				setLoading(false);
				notify("Error while uploading PNR" + " " + err.message);
			});
	};

	const { data, isLoading, isError } = useQuery<NewTaxInfo>(
		[`prn status ${date}`],
		async () => await handleGetPnrStatus(date),
		{
			cacheTime: 86400,
			staleTime: 86400 / 24,
		}
	);

	if (isLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	const onBtnExport = () => {
		//@ts-ignore: Object is possibly 'null'
		gridApi.exportDataAsCsv();
	};

	const onGridReady = (params: any) => {
		setGridApi(params.api);
	};

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const customStyles = {
		content: {
			top: "50%",
			height: "50%",
			width: "35%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
		},
		overlay: {
			backgroundColor: "rgba(0,0,0,0.5)",
		},
	};

	return (
		<div className="w-full h-full grid grid-cols-1 bg-[#F6F8FA] justify-items-center py-10 font-secondary">
			<Modal isOpen={modalIsOpen} style={customStyles}>
				<ConfirmDetails data={data!} close={closeModal} />
			</Modal>
			<div className="w-[97%] flex flex-col gap-8">
				<div className="h-1/4 w-full px-2 py-2 flex flex-col bg-white rounded-md shadow-lg">
					<div className="w-full flex justify-between  py-2">
						<div className="flex gap-2 items-center">
							<div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
								<img src={Money} alt="Money Paid" className="h-8 " />
							</div>
							<h1 className="text-xs grid grid-cols-1">
								<span className="text-xl font-extrabold">
									{" "}
									KES. {data!.totalExcise + data!.totalWithholding}
								</span>
								Amount Payable
							</h1>
						</div>
						<div>
							{date == null || date == "" ? (
								<input
									type="date"
									className="py-2 px-8 rounded bg-[#F6F8FA]"
									value={date}
									onChange={(e) =>
										setDate(moment(e.target.value).format("DD-MM-YYYY"))
									}
								/>
							) : (
								<div className="flex gap-4 items-center font-bold">
									{date}
									<img
										src={Cross}
										alt="Clear"
										className="h-6 w-6 cursor-pointer"
										onClick={() => setDate(undefined)}
									/>
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-1 items-center justify-between p">
						<Revenue
							amount={data!.deposit.total_amount}
							label="Total Deposits"
							date={date}
						/>
						<Revenue
							amount={data!.deposit.total_amount * 0.05}
							label="Total Exercise"
							date={date}
						/>
						<Revenue
							amount={data!.withdrawal.total_amount}
							label="Total Withdrawals"
							date={date}
						/>
						<Revenue
							amount={data!.withdrawal.total_amount * 0.05}
							label="Total WTH"
							date={date}
						/>
						<button
							disabled={!date == null || date == ""}
							onClick={openModal}
							className={
								date == null || date == ""
									? "bg-gray-300 px-12 py-2 rounded cursor-not-allowed"
									: "bg-secondary px-12 py-2 rounded cursor-pointer text-white font-bold"
							}
						>
							{" "}
							Pay
						</button>
					</div>
				</div>
				<div>
					<div className="pb-2 w-full flex justify-end">
						<select
							name="Data"
							id=""
							className="rounded py-2 px-4"
							onChange={(e) => setDataTable(e.target.value)}
						>
							<option value="stakes">Stakes</option>
							<option value="outcome">Outcome</option>
						</select>
					</div>
					<div
						className="h-full w-full ag-theme-alpine shadow-lg rounded-md"
						style={{ height: 500, width: "100%" }}
					>
						{dataTable == "stakes" ? (
							<AgGridReact
								rowData={data!.stakes}
								defaultColDef={{
									sortable: true,
									flex: 1,
									minWidth: 100,
									filter: true,
									resizable: true,
								}}
								pagination
								paginationPageSize={9}
								animateRows={true}
								onGridReady={onGridReady}
							>
								<AgGridColumn field="betId" />
								<AgGridColumn field="mobileNo" />
								<AgGridColumn field="exciseAmt" />
								<AgGridColumn field="stakeType" />
								<AgGridColumn field="expectedOutcomeTime" />
							</AgGridReact>
						) : (
							<AgGridReact
								rowData={data!.outcomes}
								defaultColDef={{
									sortable: true,
									flex: 1,
									minWidth: 100,
									filter: true,
									resizable: true,
								}}
								pagination
								paginationPageSize={9}
								animateRows={true}
								onGridReady={onGridReady}
							>
								<AgGridColumn field="betId" />
								<AgGridColumn field="customerId" />
								<AgGridColumn field="withholdingTax" />
								<AgGridColumn field="outcome" />
								<AgGridColumn field="outcomeDate" />
							</AgGridReact>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
