import "server-only";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/lib/env/server";
import { getS3Client } from "@/lib/storage/s3-client";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const bucket = serverEnv.storage.bucket;

  if (!bucket) {
    return new NextResponse("Bucket is not configured", {
      status: 500,
    });
  }

  const objectKey = key.join("/");

  try {
    const result = await getS3Client().send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      }),
    );

    return new NextResponse(result.Body?.transformToWebStream(), {
      headers: {
        "Content-Type": result.ContentType ?? "application/octet-stream",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", {
      status: 404,
    });
  }
}
