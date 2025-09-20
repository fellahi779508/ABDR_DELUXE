/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { cookies } from "next/headers";
import { api } from "./api";
import { CreateCar, UpdateCar } from "./Types";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";

type Car = {
	Année: string;
	Boite: string;
	Energie: string;
	Kilométrage: string;
	Moteur: string;
	color: string;
	description: string;
	finition: string;
	price: number;
};

export async function logout() {
	try {
		const response = await api.post(`/admin/logout`);
		if (response) {
			(await cookies()).delete("access_token");
			return true;
		}
	} catch (error) {
		return false;
	}
}
export async function login(username: string, password: string) {
	try {
		const response = await api.post(`/admin/login`, {
			username,
			password,
		});
		const token = response.data;

		if (token) {
			// ✅ store token in secure httpOnly cookie (Next.js side)
			(
				await // ✅ store token in secure httpOnly cookie (Next.js side)
				cookies()
			).set("access_token", token, {
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge: 7 * 24 * 60 * 60, // 7 days
			});
			return true;
		}
		return false;
	} catch {
		return false;
	}
}
export async function GetAllCars() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/car?page=0&limit=0`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function UpdateGroupCarById(id: string, data: Car[]) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		for (const car of data) {
			car.price = Number(car.price);
			const response = await api.put(
				`/car/update/${id}`,
				{ data: car },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response) {
				return response.data;
			}
		}
	} catch (error) {
		return error;
	}
}
export async function DeleteCarById(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/car/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "deleted";
		}
	} catch (error) {
		console.error(error);
		return "error";
	}
}
export async function UpdateCarById(id: string, data: UpdateCar) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(`/car/update/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "updated";
		}
	} catch (error) {
		return "error";
	}
}

export async function FetchAllBrands() {
	try {
		const response = await api.get(`/brand?page=0&limit=0`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function FetchAllSeries() {
	try {
		const response = await api.get(`/serie?page=0&limit=0`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function CreateBrand(name: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.post(
			`/brand`,
			{ name: name },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function FetchSeriesByBrand(id: number) {
	try {
		const response = await api.get(`/serie/brand/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function Createserie(name: string, brandId: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.post(
			`/serie`,
			{ name: name, brandId: brandId },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function CreateCarDB(car: CreateCar) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.post(`/car`, car, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UploadPrimaryImage(id: string, image: File) {
	const token = (await cookies()).get("access_token")?.value;
	const formData = new FormData();
	formData.append("files", image);

	try {
		const response = await api.post(
			`/color/${id}/images?isPrimary=true`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		return null;
	}
}
export async function UploadImages(id: string, image: File[]) {
	const token = (await cookies()).get("access_token")?.value;
	const formData = new FormData();
	for (const file of image) {
		formData.append("files", file);
	}
	try {
		const response = await api.post(
			`/color/${id}/images?isPrimary=false`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return null;
	}
}
export async function FetchCarImagesByColor(Colorid: number) {
	try {
		const response = await api.get(`/image/${Colorid}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}

export async function DeleteImageById(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/image/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UpdateImageToPrimary(id: string) {
	try {
		const response = await api.put(`/image/MakePrimary/${id}`);
		if (response) {
			return "updated";
		}
	} catch (error) {
		return "error";
	}
}
export async function DeleteAllCarImages(colorId: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/image/DeleteAll/${colorId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UpdateCarVisibility(id: string, isVisible: boolean) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/car/visibility/${id}/${isVisible}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return "updated";
		}
	} catch (error) {
		return "error";
	}
}
export async function GetAllVisibleCars() {
	try {
		const response = await api.get(`/car/visible`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function GetCarsOfSerie(SerieId: number) {
	try {
		const response = await api.get(`/car/serie/${SerieId}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function DeleteBrandById(id: any) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/brand/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "deleted";
		}
	} catch (error: any) {
		return error.response.data;
	}
}
export async function DeleteSerieById(id: any) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/serie/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		return error.response;
	}
}
export async function CreateNewOrder(data: any) {
	try {
		const carId = (await cookies()).get("carId")?.value;
		if (!carId) return;

		const order = { ...data, carId };
		const response = await api.post(`/order`, order);

		if (response) {
			const today = new Date().toISOString().split("T")[0];
			(await cookies()).set("OrderDate", today.toString());
			return true;
		}
	} catch (error: any) {
		console.error(error);
		return false;
	} finally {
		(await cookies()).delete("carId");
		(await cookies()).delete("price");
	}
}
export async function GetAllOrders(page: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/order?page=${page}&limit=3`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		return error.response;
	}
}
export async function SetCarIdCookie(id: string, price: number) {
	const coockie = (await cookies()).set("carId", id);
	const Price = (await cookies()).set("price", price.toString());
	if (coockie && Price) {
		return "ok";
	}
	return "error";
}

export async function AcceptOrder(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/order/accept/${id}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.error(error.response);
		return false;
	}
}
export async function CancaleOrder(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/order/cancel/${id}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.error(error.response);
		return false;
	}
}

export async function CompleteOrder(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/order/complete/${id}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return true;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
}
export async function DeleteOrderById(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/order/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "deleted";
		}
	} catch (error) {
		return "error";
	}
}
export async function GetCarsOfBrand(BrandId: number) {
	try {
		const response = await api.get(`/car/brand/${BrandId}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return [];
	}
}
export async function UpdateColorName(id: number, name: string) {
	try {
		const response = await api.put(`/color/${id}`, { name });
		if (response) {
			return "updated";
		}
	} catch (error) {
		return "error";
	}
}
export async function CreateNewColor(name: string, CarId: string) {
	try {
		const response = await api.post(`/color`, { name, CarId });
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function UpdateOption(id: number, title?: string, value?: string) {
	const body = { title, value };
	try {
		const response = await api.put(`/option/${id}`, body);
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function DeleteOptionById(id: number) {
	try {
		const response = await api.delete(`/option/${id}`);
		if (response) {
			return "deleted";
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function DeleteColorById(id: number) {
	try {
		const response = await api.delete(`/color/${id}`);
		if (response) {
			return "deleted";
		}
	} catch (error) {
		return "error";
	}
}
export async function CreateNewOption(
	title: string,
	value: string,
	CarId: string
) {
	try {
		const response = await api.post(`/option`, { title, value, CarId });
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
