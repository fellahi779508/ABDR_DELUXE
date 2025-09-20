export type Car = {
	id: string;
	Année: string;
	Boite: string;
	Energie: string;
	Kilométrage: string;
	Moteur: string;
	description: string;
	finition: string;
	isVisible: boolean | null;
	price: number;
	serie: Serie;
	slug: string;
	options: Option[];
	colors: Color[];
};
export type Option = {
	id: number;
	title: string;
	value: string;
};
export type Color = {
	id: number;
	name: string;
	images: Images[];
};
export type Serie = {
	id: number;
	name: string;
	brand: Brand;
};

export type Brand = {
	id: number;
	name: string;
	label: string;
};
export type Images = {
	id: number;
	isPrimary: boolean;
	sortOrder: number;
	url: string;
};
export type CreateCar = {
	finition?: string;

	price: number;

	Moteur: string;

	Energie: string;

	Boite: string;

	Kilométrage: string;

	Année: string;

	description?: string;

	color: string;

	isVisible: boolean;

	serieId: number;
};
export type UpdateCar = {
	finition?: string;

	price: number;

	Moteur: string;

	Energie: string;

	Boite: string;

	Kilométrage: string;

	Année: string;

	description?: string;
};
export type VisibleCar = {
	finition: string;

	price: number;

	Moteur: string;

	Energie: string;

	Boite: string;

	Kilométrage: string;

	Année: string;

	description?: string;

	color: string;
};
export type CreateOrder = {
	name: string;
	phone: string;
	address: string;
	carId: number;
};
export type Order = {
	id: number;
	name: string;
	price: number;
	address: string;
	status: string;
	cars: Car[];
};
