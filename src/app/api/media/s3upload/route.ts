import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { convertName } from "../../../../../utils/utlis";

export async function GET(req: Request) {
  const bucket = process.env.AWS_S3_BUCKET!;
  const region = process.env.AWS_REGION!;

  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get("fileType");
  const fileName = searchParams.get("fileName");

  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const name = convertName(fileName!);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: name,
    ContentType: fileType!,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.json({
    uploadUrl: signedUrl,
    fileUrl: `https://${bucket}.s3.${region}.amazonaws.com/${name}`,
  });
}
