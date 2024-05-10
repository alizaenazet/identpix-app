import { getToken } from "next-auth/jwt"

export async function GET(req: Request) {


    return Response.json({ "body": "ocee"})
  }