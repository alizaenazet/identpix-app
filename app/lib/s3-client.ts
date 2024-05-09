import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "sgp1",
    credentials: {
        accessKeyId: process.env.SPACE_KEY ?? "",
        secretAccessKey: process.env.SPACE_SECRET ?? ""
    }
})

export { s3Client };