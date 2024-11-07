import type { H3Event } from "h3";
import { createUploadthing } from "uploadthing/h3";
import type { FileRouter } from "uploadthing/h3";

// GET THE USER
import { getServerSession } from "#auth";


const f = createUploadthing();

// const auth = (ev: H3Event) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {

    // Define as many FileRoutes as you like, each with a unique routeSlug
    pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ event }) => {
            console.log('---UPLOAD ROUTER---');

            // This code runs on your server before upload
            const session = await getServerSession(event);
            console.log("user: ", session?.user);

            // If you throw, the user will not be able to upload
            if (!session?.user) throw new Error("Unauthorized");
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session?.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { fileUrl: file.url };
        }),
} satisfies FileRouter;
export type UploadRouter = typeof uploadRouter;