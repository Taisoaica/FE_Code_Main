import { StorageReference, UploadResult, deleteObject, getDownloadURL, listAll, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

const upload = async (file: File) => {

  const date = new Date();
  //same file name can cause conflict => using date like a key
  const storageRef = ref(storage, `images/${date + file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        reject("Something went wrong!" + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default upload;

//--------------Get clinic images from firebase storage----------------
export const fetchClinicImages = async (folderPath: string) => {
  const folderRef = ref(storage, folderPath);
  try {
    // List all images in the folder
    const { items } = await listAll(folderRef);
    console.log(items)
    // Get download URLs for each image
    const imageUrls = await Promise.all(items.map(async (item) => {
      const imageUrl = await getDownloadURL(item);
      return imageUrl;
    }));

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};


//--------------Upload clinic images to firebase storage----------------

export const uploadClinicImages = async (file: File, folder: 'carousel' | 'logo', clinicId: string): Promise<string> => {
  if (!file) return Promise.reject("No file");

  const timestamp = Date.now();
  const folderRef = ref(storage, `clinics/${clinicId}/${folder}`);

  if (folder === 'logo') {
    const existingFiles = await listFilesInFolder(folderRef);
    for (const fileRef of existingFiles) {
      await deleteFile(fileRef);
    }
  }

  const imageRef = ref(storage, `${folderRef.fullPath}/${timestamp}_${file.name}`);
  console.log("Uploading image:", imageRef.fullPath);

  return uploadBytes(imageRef, file)
    .then((result: UploadResult) => getDownloadURL(result.ref))
    .catch((reason) => {
      console.error("Error uploading image:", reason);
      throw reason;
    });
};

//--------------Delete clinic images from firebase storage----------------
// export const deleteClinicImage = (imagePath: string): Promise<void> => {
//   const imageRef = ref(storage, imagePath);
//   console.log("Deleting image:", imageRef.fullPath);
//   return deleteObject(imageRef);
// };

const listFilesInFolder = async (folderRef: StorageReference) => {
  try {
    const listResult = await listAll(folderRef);
    return listResult.items;
  } catch (error) {
    console.error("Error listing files in folder:", error);
    throw error;
  }
};

export const deleteFile = async (fileRef: StorageReference) => {
  try {
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
