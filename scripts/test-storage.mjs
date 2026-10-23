import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const env = {};
envFile.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const s3 = new S3Client({
  endpoint: env.AWS_ENDPOINT_URL_S3,
  region: env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

async function testStorage() {
  const bucketName = 'assets';
  console.log(`Testing Neon Object Storage with bucket '${bucketName}'...`);
  
  // 1. Put an object
  const testKey = 'test-probe.txt';
  const testBody = `Neon Object Storage Probe at ${new Date().toISOString()}`;
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: testKey,
    Body: testBody,
    ContentType: 'text/plain',
  }));
  console.log(`Successfully uploaded '${testKey}'!`);

  // 2. List objects
  const listResp = await s3.send(new ListObjectsV2Command({
    Bucket: bucketName,
  }));
  console.log(`Objects in '${bucketName}':`, listResp.Contents?.map(o => ({ key: o.Key, size: o.Size })));

  // 3. Get object
  const getResp = await s3.send(new GetObjectCommand({
    Bucket: bucketName,
    Key: testKey,
  }));
  const body = await getResp.Body.transformToString();
  console.log(`Read object content: "${body}"`);

  console.log("Object storage test PASSED!");
}

testStorage().catch(err => {
  console.error("Storage test error:", err);
  process.exit(1);
});
