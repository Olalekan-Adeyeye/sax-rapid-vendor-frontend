export type FlatProductValues = {
	name: string;
	description: string;
	categoryId: string;
	brandId: string;
	type: "simple" | "variable";
	regularPrice: string;
	salePrice?: string;
	saleStartDate?: string;
	saleEndDate?: string;
	stockQuantity: string;
	sku?: string;
	weight: string;
	length?: string;
	width?: string;
	height?: string;
	status?: string;
	attributes: Attribute[];
	variations: Variation[];
	images: string[];
};

export interface Attribute {
	id: string;
	name: string;
	values: string[];
}

export interface Variation {
	id: string;
	name: string;
	price: string;
	salePrice?: string;
	saleStartDate?: string;
	saleEndDate?: string;
	stock: string;
	attributes?: { attributeName: string; attributeValue: string }[];
	imageUrl?: string;
}
