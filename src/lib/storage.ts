import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Configure Neon Object Storage S3 Client using Neon deployed environment variables
export const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export const DEFAULT_BUCKET = "assets";

/**
 * Upload an asset or document to Neon Object Storage
 */
export async function uploadObject(
  key: string,
  body: string | Uint8Array | Buffer,
  contentType = "application/octet-stream",
  bucket = DEFAULT_BUCKET
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return await s3Client.send(command);
}

/**
 * List objects in the bucket
 */
export async function listObjects(prefix = "", bucket = DEFAULT_BUCKET) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });
  const res = await s3Client.send(command);
  return res.Contents || [];
}

/**
 * Read text content from an object
 */
export async function getObjectText(key: string, bucket = DEFAULT_BUCKET) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const res = await s3Client.send(command);
  if (!res.Body) return null;
  return await res.Body.transformToString();
}
