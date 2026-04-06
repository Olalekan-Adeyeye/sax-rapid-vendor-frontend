export const ATTRIBUTE_CATEGORIES = [
	{
		label: "Apparel & Fashion",
		keywords: ["fashion", "apparel", "cloth", "shoe", "wear", "dress", "shirt", "jewel", "access", "bag"],
		attributes: [
			{ name: "Size", example: "S, M, L", defaultValues: ["S", "M", "L", "XL", "XXL"] },
			{ name: "Color", example: "Red, Blue", defaultValues: ["Red", "Blue", "Black", "White", "Grey"] },
			{ name: "Shoe Size", example: "8, 9, 10", defaultValues: ["US 7", "US 8", "US 9", "US 10", "US 11"] },
			{ name: "Material", example: "Cotton", defaultValues: ["Cotton", "Leather", "Polyester", "Wool"] },
			{ name: "Fit", example: "Slim, Regular", defaultValues: ["Slim Fit", "Regular Fit", "Relaxed Fit"] }
		]
	},
	{
		label: "Electronics & Tech",
		keywords: ["electronic", "phone", "computer", "laptop", "gadget", "audio", "camera", "tech", "appliance", "smart"],
		attributes: [
			{ name: "Storage", example: "128GB", defaultValues: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
			{ name: "RAM", example: "8GB, 16GB", defaultValues: ["4GB", "8GB", "16GB", "32GB"] },
			{ name: "Screen Size", example: "15\"", defaultValues: ["13\"", "14\"", "15.6\"", "27\""] },
			{ name: "Processor", example: "i5, i7", defaultValues: ["Core i5", "Core i7", "Core i9", "Ryzen 5", "Ryzen 7"] },
			{ name: "Color", example: "Space Grey", defaultValues: ["Space Grey", "Silver", "Midnight", "Starlight"] }
		]
	},
	{
		label: "Home & Furniture",
		keywords: ["home", "furniture", "kitchen", "decor", "garden", "bed", "bath", "living"],
		attributes: [
			{ name: "Dimensions", example: "Small, Large", defaultValues: ["Small", "Medium", "Large"] },
			{ name: "Material", example: "Wood, Metal", defaultValues: ["Wood", "Metal", "Plastic", "Glass"] },
			{ name: "Finish", example: "Matte", defaultValues: ["Matte", "Glossy", "Oak", "Walnut", "White"] },
			{ name: "Bed Size", example: "Queen, King", defaultValues: ["Twin", "Full", "Queen", "King"] }
		]
	},
	{
		label: "Beauty & Health",
		keywords: ["beauty", "health", "care", "makeup", "skin", "hair", "fragrance", "cosmetic"],
		attributes: [
			{ name: "Volume", example: "50ml", defaultValues: ["30ml", "50ml", "100ml", "250ml"] },
			{ name: "Skin Type", example: "Oily, Dry", defaultValues: ["All", "Oily", "Dry", "Combination", "Sensitive"] },
			{ name: "Scent", example: "Floral", defaultValues: ["Floral", "Citrus", "Woody", "Fresh", "Vanilla"] },
			{ name: "Shade", example: "Light, Dark", defaultValues: ["Fair", "Light", "Medium", "Tan", "Deep"] }
		]
	},
	{
		label: "Grocery & Consumables",
		keywords: ["grocery", "food", "drink", "supplement", "snack", "pantry"],
		attributes: [
			{ name: "Weight", example: "1kg", defaultValues: ["250g", "500g", "1kg", "2kg", "5kg"] },
			{ name: "Flavor", example: "Vanilla", defaultValues: ["Vanilla", "Chocolate", "Strawberry", "Unflavored"] },
			{ name: "Dietary", example: "Vegan", defaultValues: ["Vegan", "Gluten-Free", "Organic", "Keto", "Halal"] },
			{ name: "Pack Size", example: "1-Pack", defaultValues: ["1-Pack", "3-Pack", "6-Pack", "12-Pack"] }
		]
	},
	{
		label: "Vehicles & Auto",
		keywords: ["vehicle", "auto", "car", "motor", "part", "wheel", "engine"],
		attributes: [
			{ name: "Condition", example: "New, Used", defaultValues: ["New", "Used", "Refurbished"] },
			{ name: "Make", example: "Toyota", defaultValues: ["Toyota", "Honda", "Ford", "BMW", "Mercedes"] },
			{ name: "Year", example: "2024", defaultValues: ["2024", "2023", "2022", "2021", "2020"] },
			{ name: "Transmission", example: "Auto", defaultValues: ["Automatic", "Manual", "CVT"] }
		]
	},
	{
		label: "Books & Media",
		keywords: ["book", "media", "read", "music", "dvd", "vinyl", "novel"],
		attributes: [
			{ name: "Format", example: "Paperback", defaultValues: ["Hardcover", "Paperback", "Kindle", "Audiobook"] },
			{ name: "Condition", example: "New, Used", defaultValues: ["New", "Like New", "Good", "Acceptable"] },
			{ name: "Language", example: "English", defaultValues: ["English", "Spanish", "French", "German"] }
		]
	},
	{
		label: "Toys & Babies",
		keywords: ["toy", "kid", "baby", "child", "game", "toddler"],
		attributes: [
			{ name: "Age Group", example: "3-5 years", defaultValues: ["0-2 years", "3-5 years", "6-8 years", "9-12 years"] },
			{ name: "Material", example: "Plastic", defaultValues: ["Plastic", "Wood", "Plush", "Silicone"] },
			{ name: "Color", example: "Red, Blue", defaultValues: ["Red", "Blue", "Green", "Yellow", "Pink"] }
		]
	},
	{
		label: "Pet Supplies",
		keywords: ["pet", "dog", "cat", "bird", "fish", "animal"],
		attributes: [
			{ name: "Pet Type", example: "Dog, Cat", defaultValues: ["Dog", "Cat", "Bird", "Fish", "Small Animal"] },
			{ name: "Size", example: "Small", defaultValues: ["Small", "Medium", "Large", "Giant"] },
			{ name: "Flavor", example: "Beef", defaultValues: ["Beef", "Chicken", "Fish", "Lamb"] }
		]
	},
	{
		label: "Sports & Outdoors",
		keywords: ["sport", "outdoor", "fitness", "gym", "camp", "active"],
		attributes: [
			{ name: "Size", example: "S, M, L", defaultValues: ["S", "M", "L", "XL"] },
			{ name: "Resistance", example: "Light", defaultValues: ["Light", "Medium", "Heavy", "Extra Heavy"] },
			{ name: "Color", example: "Black", defaultValues: ["Black", "Blue", "Red", "Green"] }
		]
	}
];
