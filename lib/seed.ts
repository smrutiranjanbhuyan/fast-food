import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";
import * as FileSystem from "expo-file-system";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// Ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file: any) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}
async function uploadImageToStorage(imageUrl: string): Promise<string> {
    try {
        console.log("Downloading image from URL:", imageUrl);
        const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;
        const fileUri = FileSystem.documentDirectory + fileName;

        const downloadRes = await FileSystem.downloadAsync(imageUrl, fileUri);
        console.log("Image downloaded to:", downloadRes.uri);

        // Get file info to fetch size
        const fileInfo = await FileSystem.getInfoAsync(downloadRes.uri);
        if (!fileInfo.exists || fileInfo.size == null) {
            throw new Error("File does not exist or size unknown.");
        }

        const file = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            {
                uri: downloadRes.uri,
                name: fileName,
                type: "image/jpeg", // optional: detect dynamically
                size: fileInfo.size,
            }
        );

        const url = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
        console.log("Uploaded image URL:", url);

        return storage.getFileViewURL(appwriteConfig.bucketId, file.$id).toString();

    } catch (error) {
        console.error(`❌ Error uploading image (${imageUrl}):`, error);
        throw error;
    }
}

async function seed(): Promise<void> {
    try {
        console.log("🚧 Starting seed...");

        // 1. Clear all collections and storage
        await clearAll(appwriteConfig.categoryCollectionId);
        await clearAll(appwriteConfig.customizationsCollectionId);
        await clearAll(appwriteConfig.menuCollectionId);
        await clearAll(appwriteConfig.menuCustomizationsCollectionId);
        await clearStorage();

        // 2. Create Categories
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.categoryCollectionId,
                ID.unique(),
                cat
            );
            categoryMap[cat.name] = doc.$id;
        }

        // 3. Create Customizations
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.customizationsCollectionId,
                ID.unique(),
                {
                    name: cus.name,
                    price: cus.price,
                    type: cus.type,
                }
            );
            customizationMap[cus.name] = doc.$id;
        }

        // 4. Create Menu Items and Upload Images
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            const uploadedImage = await uploadImageToStorage(item.image_url);

            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCollectionId,
                ID.unique(),
                {
                    name: item.name,
                    description: item.description,
                    image_url: uploadedImage,
                    price: item.price,
                    rating: item.rating,
                    calories: item.calories,
                    protein: item.protein,
                    categories: categoryMap[item.category_name],
                }
            );

            menuMap[item.name] = doc.$id;

            // 5. Link Menu Items to Customizations
            for (const cusName of item.customizations) {
                await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCustomizationsCollectionId,
                    ID.unique(),
                    {
                        menu: doc.$id,
                        customizations: customizationMap[cusName],
                    }
                );
            }
        }

        console.log("✅ Seeding complete.");
    } catch (error: any) {
        console.error("❌ Seed failed:", error.message || error);
    }
}

export default seed;
