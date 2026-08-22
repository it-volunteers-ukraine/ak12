import "server-only";

import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { getMinioClient } from "@/lib/storage/minio.client";
import { serverEnv } from "@/lib/env/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const bucket = serverEnv.storage.bucket;
  const mediaFolder = serverEnv.storage.mediaFolder;

  if (!bucket || !mediaFolder) {
    return new NextResponse("Storage is not configured", {
      status: 500,
    });
  }

  const objectKey = key.join("/");
  const prefix = `${mediaFolder}/`;

  if (!objectKey.startsWith(prefix)) {
    return new NextResponse("Requested media file was not found", {
      status: 404,
    });
  }

  try {
    const client = getMinioClient();
    const metadata = await client.statObject(bucket, objectKey);
    const objectStream = await client.getObject(bucket, objectKey);
    const webStream = Readable.toWeb(objectStream);

    return new NextResponse(webStream as ReadableStream, {
      headers: {
        "Content-Type": metadata.metaData?.["content-type"] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if (hasErrorCode(error, "NotFound") || hasErrorCode(error, "NoSuchKey")) {
      return new NextResponse("Requested media file was not found", {
        status: 404,
      });
    }

    throw error;
  }
}

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}
