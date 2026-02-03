import { auth, } from "@clerk/nextjs/server";

export async function verifyUser(){
    const { isAuthenticated, redirectToSignIn, userId } = await auth();
    if (!isAuthenticated) return redirectToSignIn();
    return userId
}