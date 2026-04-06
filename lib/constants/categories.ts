import { CategoryResponseDTO } from "../api/types/categories.types";

export const ROBUST_CATEGORIES: CategoryResponseDTO[] = [
	{
		id: 1,
		name: "Fashion",
		description: "Clothing, shoes and accessories",
		parentId: null,
		parentName: null,
		iconUrl: "icons/fashion.png",
		displayOrder: 1,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 9, name: "Men's Clothing", description: null, parentId: 1, parentName: "Fashion", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 10, name: "Women's Clothing", description: null, parentId: 1, parentName: "Fashion", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 11, name: "Shoes", description: null, parentId: 1, parentName: "Fashion", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 12, name: "Bags & Luggage", description: null, parentId: 1, parentName: "Fashion", iconUrl: null, displayOrder: 4, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 13, name: "Watches & Jewelry", description: null, parentId: 1, parentName: "Fashion", iconUrl: null, displayOrder: 5, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 2,
		name: "Electronics",
		description: "Phones, laptops and gadgets",
		parentId: null,
		parentName: null,
		iconUrl: "icons/electronics.png",
		displayOrder: 2,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 14, name: "Phones & Tablets", description: null, parentId: 2, parentName: "Electronics", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 15, name: "Laptops & Computers", description: null, parentId: 2, parentName: "Electronics", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 16, name: "TV & Audio", description: null, parentId: 2, parentName: "Electronics", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 17, name: "Cameras", description: null, parentId: 2, parentName: "Electronics", iconUrl: null, displayOrder: 4, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 18, name: "Gaming", description: null, parentId: 2, parentName: "Electronics", iconUrl: null, displayOrder: 5, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 3,
		name: "Home & Garden",
		description: "Furniture and appliances",
		parentId: null,
		parentName: null,
		iconUrl: "icons/home.png",
		displayOrder: 3,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 19, name: "Furniture", description: null, parentId: 3, parentName: "Home & Garden", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 20, name: "Kitchen & Dining", description: null, parentId: 3, parentName: "Home & Garden", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 21, name: "Bedding & Bath", description: null, parentId: 3, parentName: "Home & Garden", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 22, name: "Garden & Outdoors", description: null, parentId: 3, parentName: "Home & Garden", iconUrl: null, displayOrder: 4, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 4,
		name: "Health & Beauty",
		description: "Skincare and wellness",
		parentId: null,
		parentName: null,
		iconUrl: "icons/health.png",
		displayOrder: 4,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 23, name: "Skincare", description: null, parentId: 4, parentName: "Health & Beauty", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 24, name: "Hair Care", description: null, parentId: 4, parentName: "Health & Beauty", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 25, name: "Vitamins & Supplements", description: null, parentId: 4, parentName: "Health & Beauty", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 26, name: "Fragrances", description: null, parentId: 4, parentName: "Health & Beauty", iconUrl: null, displayOrder: 4, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 5,
		name: "Vehicles & Auto",
		description: "Cars and parts",
		parentId: null,
		parentName: null,
		iconUrl: "icons/vehicles.png",
		displayOrder: 5,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 27, name: "Car Parts", description: null, parentId: 5, parentName: "Vehicles & Auto", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 28, name: "Tires & Wheels", description: null, parentId: 5, parentName: "Vehicles & Auto", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 29, name: "Accessories", description: null, parentId: 5, parentName: "Vehicles & Auto", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 6,
		name: "Groceries",
		description: "Daily essentials",
		parentId: null,
		parentName: null,
		iconUrl: "icons/grocery.png",
		displayOrder: 6,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 30, name: "Pantry", description: null, parentId: 6, parentName: "Groceries", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 31, name: "Beverages", description: null, parentId: 6, parentName: "Groceries", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 32, name: "Snacks", description: null, parentId: 6, parentName: "Groceries", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 7,
		name: "Sports & Fitness",
		description: "Gym and active gear",
		parentId: null,
		parentName: null,
		iconUrl: "icons/sports.png",
		displayOrder: 7,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 33, name: "Gym Equipment", description: null, parentId: 7, parentName: "Sports & Fitness", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 34, name: "Cycling", description: null, parentId: 7, parentName: "Sports & Fitness", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 35, name: "Outdoor Adventure", description: null, parentId: 7, parentName: "Sports & Fitness", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 8,
		name: "Baby & Toys",
		description: "Everything for kids",
		parentId: null,
		parentName: null,
		iconUrl: "icons/toys.png",
		displayOrder: 8,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 36, name: "Toys & Games", description: null, parentId: 8, parentName: "Baby & Toys", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 37, name: "Baby Care", description: null, parentId: 8, parentName: "Baby & Toys", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 38, name: "Kids' Fashion", description: null, parentId: 8, parentName: "Baby & Toys", iconUrl: null, displayOrder: 3, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 39,
		name: "Office Supplies",
		description: "Stationery and furniture",
		parentId: null,
		parentName: null,
		iconUrl: "icons/office.png",
		displayOrder: 9,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 40, name: "Stationery", description: null, parentId: 39, parentName: "Office Supplies", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 41, name: "Office Electronics", description: null, parentId: 39, parentName: "Office Supplies", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	},
	{
		id: 42,
		name: "Industrial & Tools",
		description: "Tools and hardware",
		parentId: null,
		parentName: null,
		iconUrl: "icons/tools.png",
		displayOrder: 10,
		isActive: true,
		createdAt: new Date().toISOString(),
		subCategories: [
			{ id: 43, name: "Power Tools", description: null, parentId: 42, parentName: "Industrial & Tools", iconUrl: null, displayOrder: 1, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
			{ id: 44, name: "Hand Tools", description: null, parentId: 42, parentName: "Industrial & Tools", iconUrl: null, displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), subCategories: [] },
		]
	}
];
