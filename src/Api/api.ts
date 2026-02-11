import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { NewTaxInfo } from "../Models/api";
import { CreateReportApiModel, Summary } from "../Models/reports";
import { User, UserAuth } from "../Models/users";

let baseURL: string = `${import.meta.env.VITE_APP_API_URL}`;
const IRIS_IP_ADDRESS: string = `${import.meta.env.VITE_IRIS_IP_ADDRESS}`;

axios.defaults.baseURL = `${baseURL}/v1`;

export const handleGetData = async (): Promise<Summary> => {
	let response = await axios({
		method: "GET",
		url: `/reports`,
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.data;
};
export const handleGetFilteredData = async (
	dataProps: any
): Promise<Summary> => {
	let data = await axios(`/reports/filter`, {
		method: "GET",
		params: dataProps,
	});

	return data.data;
};

export const handleAuth = async (
	data: UserAuth
): Promise<AxiosResponse<User>> => {
	let resp = await axios(`/login`, {
		method: "POST",
		data,
	});

	return resp;
};
export const handleAddReport = async (
	data: CreateReportApiModel
): Promise<AxiosResponse> => {
	let resp = await axios(`/reports`, {
		method: "POST",
		data: data,
	});

	return resp;
};

export const handleUploadCsvReport = async (
	data: FormData
): Promise<AxiosResponse> => {
	try {
		let resp = await axios({
			method: "POST",
			url: "/upload-bets",
			data: data,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return resp;
	} catch (error: unknown) {
		throw error;
	}
};

export const handlePnrUpload = async (data: {
	forDate: string;
	payExcise: boolean;
	payWHT: boolean;
}): Promise<AxiosResponse> => {
	try {
		let res = await axios({
			url: "/pay-tax",
			data: data,
		});

		return res;
	} catch (error: unknown) {
		throw error;
	}
};

export const handleGetPnrStatus = async (
	data: string | undefined
): Promise<NewTaxInfo> => {
	try {
		let res = await axios.request<NewTaxInfo>({
			baseURL: IRIS_IP_ADDRESS,
			url: `/api/v1/payment/summary?withdrawal_paybill=290030&start_date=${data || moment().format("YYYY-MM-DD")}&end_date=${moment(data).subtract(1, "days").format("YYYY-MM-DD")}`,
			data: data,
		});

		return res.data;
	} catch (error: unknown) {
		throw error;
	}
};
