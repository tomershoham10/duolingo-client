// pages/api/authenticate.ts
import { NextRequest, NextResponse } from "next/server";

const url = "https://jsonplaceholder.typicode.com/todos";
const API_KEY: string = "DaveGrayTeachingCode";

export async function GET() {
    try {
        const users = fetch("http://localhost:8080/api/users/", {
            method: "GET",
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Authentication Error:", error);
    }
}



// export async function POST(req: Request) {
//     // console.log("test");
//     if (req.method === "POST") {
//         try {
//             // console.log(req.body);
//             const request = await req.json();
//             const body = request.body;

//                 .get("http://localhost:8080/api/users/", {
//                     headers: {
//                         "Content-Type": "application/json",
//                         "API-Key": API_KEY,
//                     },
//                 })
//                 .then((response) => {
//                     console.log(response);
//                 });

//             return NextResponse.json({ message: "This Worked", success: true });
//         } catch (error) {
//             console.error("Authentication Error:", error);
//         }
//     }
// }

// export async function DELETE(req: NextRequest) {
//     // console.log("test");
//     if (req.method === "DELETE") {
//         try {
//             // console.log("Clicked", req.method, req.body);
//             const resp = await axios.get(url);
//             console.log("resp");
//             return resp;
//             // const todos = await resp.on()

//             // return res.json({
//             //     msg: "Successfuly created new User: ",
//             // });

//             // const authenticatedUser = {
//             //     id: 123,
//             //     username: "user123",
//             // };
//             res.json();
//             // res.status(200).json(authenticatedUser);
//         } catch (error) {
//             console.error("Authentication Error:", error);
//             // res.status(500).json({ error: "Authentication failed" });
//         }
//     } else {
//         // res.status(405).end();
//     }
// }
