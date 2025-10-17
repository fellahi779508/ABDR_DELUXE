/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { cookies } from "next/headers";
import { api } from "./api";
import { CreateCar, UpdateCar } from "./Types";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";
import { trackSynchronousPlatformIOAccessInDev } from "next/dist/server/app-render/dynamic-rendering";
import { a, q, tr } from "framer-motion/client";

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
			return response.data;
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
	} catch (error: any) {
		return error.response.data.message;
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
	console.log(car);
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
	} catch (error: any) {
		console.error(error.response);
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
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/image/MakePrimary/${id}`,
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
	const token = (await cookies()).get("access_token")?.value;
	console.log(data);
	try {
		const response = await api.post(
			`/order`,
			{
				name: data.name,
				email: data.email,
				phone: data.phone,
				address: data.address,
				cartId: data.cartId,
				passport: data.passport,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (response) {
			(await cookies()).set("orderDate", new Date().toISOString());
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return false;
	}
}
export async function GetAllOrders(page: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/order?page=${page}&limit=0`, {
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
export async function DeliverOrder(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/order/deliver/${id}`,
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
export async function RefundOrder(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/order/refund/${id}`,
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
export async function SearchOrders(query: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/order/search/${query}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response.data.message);
		return [{}];
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
export async function ResetCarViews(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/car/views/reset/${id}`,

			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			console.log(response.data);
			return true;
		}
	} catch (error) {
		console.error(error.response);
		return false;
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
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/color/${id}`,
			{ name },
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
export async function CreateNewColor(name: string, CarId: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.post(
			`/color`,
			{ name, CarId },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function UpdateOption(id: number, title?: string, value?: string) {
	const token = (await cookies()).get("access_token")?.value;
	const data = { title, value };
	try {
		const response = await api.put(`/option/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function DeleteOptionById(id: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/option/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "deleted";
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function DeleteColorById(id: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/color/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "deleted";
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function CreateNewOption(
	title: string,
	value: string,
	CarId: string
) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.post(
			`/option`,
			{ title, value, CarId },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return "error";
	}
}
export async function GetAllUsedCars() {
	try {
		const response = await api.get(`/car/used`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllNewCars() {
	try {
		const response = await api.get(`/car/new`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllBrandsOfUsedCars() {
	try {
		const response = await api.get(`/brand/UsedCars`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllBrandsOfNewCars() {
	try {
		const response = await api.get(`/brand/NewCars`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllVisibleCars() {
	try {
		const response = await api.get(`/car/visible`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllNewCarsOfSerie(id: number) {
	try {
		const response = await api.get(`/car/new/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllUsedCarsOfSerie(id: number) {
	try {
		const response = await api.get(`/car/used/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllNewCarsOfBrand(id: number) {
	try {
		const response = await api.get(`/car/new/brand/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllUsedCarsOfBrand(id: number) {
	try {
		const response = await api.get(`/car/used/brand/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllVisibleNewCars() {
	try {
		const response = await api.get(`/car/visible/new`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function GetAllVisibleUsedCars() {
	try {
		const response = await api.get(`/car/visible/used`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function SearchCars(searchQuery: string) {
	try {
		const response = await api.get(`/car/browse/${searchQuery}`);
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function UploadBrandIcon(brandId: number, file: File) {
	const token = (await cookies()).get("access_token")?.value;
	const formData = new FormData();
	formData.append("file", file);
	try {
		const response = await api.post(`/brand/icons/${brandId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		return error.response.data.message;
	}
}
export async function GetCarBySlug(slug: string) {
	try {
		const response = await api.get(`/car/slug/${slug}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return {};
	}
}
export async function CreateSoldItem(
	quantity: number,
	carSlug: string,
	color: string
) {
	console.log(quantity, carSlug, color);
	try {
		const response = await api.post(`/soldItem`, { quantity, carSlug, color });
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return {};
	}
}
export async function DeleteSoldItemById(id: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/soldItem/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error: any) {
		console.log(error.response);
		return {};
	}
}
export async function UpdateSoldItemQantity(id: number, quantity: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(
			`/soldItem/${id}?quantity=${quantity}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response) {
			console.log(response.data);
			return true;
		}
	} catch (error: any) {
		console.log(error.response.data.message);
		return {};
	}
}
export async function CreateCart(soldItemId: number[]) {
	try {
		const response = await api.post(`/cart`, { soldItemId });
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return {};
	}
}
export async function DeleteAllOrders() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/order/all`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return {};
	}
}
export async function UploadPromotionPic(carSlug: string | null, file: File) {
	const token = (await cookies()).get("access_token")?.value;
	const formData = new FormData();
	formData.append("file", file);
	try {
		const response = await api.post(`/promoPic/${carSlug}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.log(error.response);
		return [];
	}
}
export async function DeletePromoById(id: number) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/promoPic/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.error(error.response.data.message);
		return false;
	}
}

export async function DeleteAllPromotions() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/promoPic`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.error(error.response.data.message);
		return false;
	}
}
export async function GetAllCarsSlug() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/car/AllSlugs`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return error.response.data.message;
	}
}
export async function GetAllPromotions() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/promoPic`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return [];
	}
}
export async function UploadGalleryPic(files: File[]) {
	const token = (await cookies()).get("access_token")?.value;
	const formData = new FormData();
	for (const file of files) {
		formData.append("files", file);
	}
	try {
		const response = await api.post(`/gallery`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.log(error.response);
		return [];
	}
}
export async function DeleteGalleryPic(id: number) {
	const token = (await cookies()).get("access_token")?.value;
	console.log(id);
	try {
		const response = await api.delete(`/gallery/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.error(error.response);
		return false;
	}
}
export async function DeleteAllGallery() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.delete(`/gallery`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return true;
		}
	} catch (error: any) {
		console.error(error.response);
		return false;
	}
}
export async function GetAllGallery() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/gallery`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error: any) {
		console.error(error.response);
		return error.response.data.message;
	}
}
export async function IncrementViews(slug: string) {
	const view = (await cookies()).get(`${slug}_view`);
	console.log(view);
	if (view) {
		return;
	}
	try {
		const response = await api.post(`/car/view/${slug}`);
		if (response) {
			(await cookies()).set(`${slug}_view`, "true");
			return response.data;
		}
	} catch (error: any) {
		console.log(error.data);
		return [];
	}
}
export async function UpdateBrandLogo(id: number, file: File) {
	const token = (await cookies()).get("access_token")?.value;
	const formData = new FormData();
	formData.append("file", file);
	try {
		const response = await api.put(`/brand/icons/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			console.log(response.data);
			return true;
		}
	} catch (error: any) {
		console.log(error.response);
		return false;
	}
}
export async function ExportOrderToExcel(id: string) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/order/export/excel/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return process.env.MAIN_API_URL + "/order/export/excel/" + id;
		}
	} catch (error: any) {
		console.error(error.response);
		return false;
	}
}
