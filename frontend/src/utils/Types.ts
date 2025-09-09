export type Car = {
	id: string;
	Année: string;
	Boite: string;
	Energie: string;
	Kilométrage: string;
	Moteur: string;
	color: string;
	description: string;
	finition: string;
	isVisible: boolean | null;
	price: number;
	serie: Serie;
	slug: string;
	images: Images[];
};
export type Serie = {
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

	color: string;
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
