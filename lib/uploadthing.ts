import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  eventCoverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", file.url)
      return { uploadedBy: metadata }
    }),

  eventImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", file.url)
      return { uploadedBy: metadata }
    }),

  userAvatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for:", file.url)
      return { uploadedBy: metadata }
    }),

  resultsCsv: f({ "text/csv": { maxFileSize: "1MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("CSV upload complete for:", file.url)
      return { uploadedBy: metadata }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
