import "server-only";

import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { getMinioClient } from "@/lib/storage/minio.client";
import { serverEnv } from "@/lib/env/server";

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
    const client = getMinioClient();
    const metadata = await client.statObject(bucket, objectKey);
    const objectStream = await client.getObject(bucket, objectKey);
    const webStream = Readable.toWeb(objectStream);

    return new NextResponse(webStream as ReadableStream, {
      headers: {
        "Content-Type": metadata.metaData?.["content-type"] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", {
      status: 404,
    });
  }
}
