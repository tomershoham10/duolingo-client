// import jwt from "jsonwebtoken";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import { PermissionsTypes } from "./app/store/stores/useUserStore";

export async function middleware(request: NextRequest) {
    const { pathname }: { pathname: string } = request.nextUrl;

    const jwtToken = request.cookies.get("jwtToken")?.value;
    // console.log('middleware', jwtToken);

    const userData = decode(
        jwtToken || '',
    ) as JwtPayload;
    // console.log(userData)
    // return NextResponse.redirect(new URL('/login', request.url));

    const Redirect = () => {
        if (userData.role === PermissionsTypes.ADMIN) {
            return NextResponse.redirect(new URL("/classroom", request.url));
        } else if (userData.role === PermissionsTypes.STUDENT) {
            return NextResponse.redirect(new URL("/learn", request.url));
        } else {
            return NextResponse.redirect(
                new URL(
                    "/login",
                    request.url
                )
            );
        }
    };
    if (!!jwtToken && pathname === '/login') {
        return Redirect();
    }


    if (
        (!!jwtToken && pathname.startsWith("/classroom") && userData.role !== PermissionsTypes.ADMIN) ||

        (!!jwtToken &&
            (pathname.startsWith("/learn") || pathname.startsWith("/lesson")) &&
            userData.role !== PermissionsTypes.STUDENT)
    ) {
        return Redirect();
    }

    if (!jwtToken) {
        if (
            pathname.includes("/classroom") ||
            pathname.includes("/learn") ||
            pathname.includes("/lesson")
        ) {
            return NextResponse.redirect(
                new URL(
                    "/login",
                    request.url
                ));
            // return Response.json(
            //     { success: false, message: "authentication failed" },
            //     { status: 401 }
            // );
        }
    } else {
        if (
            (!!jwtToken && pathname.startsWith("/classroom") && userData.role !== PermissionsTypes.ADMIN) ||
            (!!jwtToken &&
                (pathname.startsWith("/learn") || pathname.startsWith("/lesson")) &&
                userData.role !== PermissionsTypes.STUDENT)
        ) {
            return Response.json(
                { success: false, message: "authentication failed" },
                { status: 401 }
            );
        }
    }

}


export const config = {
    matcher: [
        "/:path*",
    ],
};