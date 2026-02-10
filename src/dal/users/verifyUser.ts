import { auth, } from "@clerk/nextjs/server";
import { cache } from "react";

export const verifyUser = cache(async () => {
    const { isAuthenticated, redirectToSignIn, userId } = await auth();
    if (!isAuthenticated) return redirectToSignIn();
    return userId
})