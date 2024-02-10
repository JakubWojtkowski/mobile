import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile(
        "65c25b62c86c571f9244",
        ID.unique(),
        file
    );

    return fileUploaded;
};

export default uploadImage;