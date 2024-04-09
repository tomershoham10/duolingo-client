import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import { PermissionsTypes } from "./app/store/stores/useUserStore";

export async function middleware(request: NextRequest) {
    const jwtToken = request.cookies.get("jwtToken")?.value;
    console.log('middleware', jwtToken);
    if (!!!jwtToken) {

        return NextResponse.redirect(
            new URL(
                "/login",
                request.url
            )
        );
    }
    const userData = jwt.decode(
        jwtToken,
    ) as jwt.JwtPayload;
    console.log(userData)
    // return NextResponse.redirect(new URL('/login', request.url));

    const Redirect = () => {
        if (userData.role === PermissionsTypes.ADMIN) {
            return NextResponse.redirect(new URL("/classroom", request.url));
        } else if (userData.role === PermissionsTypes.STUDENT) {
            return NextResponse.redirect(new URL("/learn", request.url));
        }
    };
    Redirect();

}


export const config = {
    matcher: [
        "/:path*",
    ],
};