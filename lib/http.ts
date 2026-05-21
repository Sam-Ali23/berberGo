import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, message?: string, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    init,
  );
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      details,
    },
    { status },
  );
}
