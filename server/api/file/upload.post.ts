import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();

export default defineEventHandler(async (event) => {

  console.log('---UPLOAD FILE API---');


  try {
    const formData = await readMultipartFormData(event);
    // Estrarre il file dal formData
    console.log(formData);

    const file = formData?.find(item => item.name === 'file');

    console.log(file);

    if (!file || !file.filename) {
      throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
    }

    const response = await utapi.uploadFiles(new File([file.data], file.filename));

    console.log(response);


    return { statusCode: 200, body: response.data?.url };
  } catch (error) {
    console.error("Upload failed:", error);
    throw createError({ statusCode: 500, statusMessage: "Upload failed" });
  }



})

