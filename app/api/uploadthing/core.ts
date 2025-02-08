import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

console.log("🚀 UPLOADTHING_SECRET:", process.env.UPLOADTHING_TOKEN);
console.log("🚀 UPLOADTHING_APP_ID:", process.env.UPLOADTHING_APP_ID);

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      // if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session?.user?.id };
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("📂 Incoming File:", file); // Print file details
      console.log("📝 Metadata:", metadata);
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
