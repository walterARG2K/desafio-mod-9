import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const headersObj = {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": req.headers.get("Access-Control-Request-Headers"),
        Vary: "Access-Control-Request-Headers",
        "Content-Length": "0",
    };

    const headersColl = Object.entries(headersObj);
    headersColl.forEach((i) => req.headers.append(i[0], i[1]));
    return NextResponse.next();
}
