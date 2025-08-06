import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  categoryCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID!,
  menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
  customizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID!,

  menuCustomizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID!,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({ name, email, password }: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Account creation failed");

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );

    return newUser;

  } catch (error: any) {
    throw new Error(error.message || "Error creating user");
  }
};



export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    
  } catch (error: any) {
    throw new Error(error.message || "Sign in failed");
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Sign out failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw new Error("No active account session found");
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('accountId', currentAccount.$id)
      ]
    );

    if (!currentUser.documents.length) {
      throw new Error("User not found in database");
    }

    return currentUser.documents[0];

  } catch (error: any) {
    console.error("getCurrentUser error:", error.message);
    throw new Error(error.message || "Failed to get current user");
  }
};


export const getMenu = async ({ category, query, limit = 6 }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal('categories', category));
    if (query) queries.push(Query.search('name', query));

    queries.push(Query.limit(limit));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries,
    );

    return menus.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getMenuById = async ({ id }: { id: string }) => {
  try {
    const menu = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      id
    );

    return menu; 
  } catch (e: any) {
    throw new Error(e.message || "Failed to fetch menu by ID");
  }
};



export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
    )

    return categories.documents;
  } catch (e) {
    throw new Error(e as string);
  }
}