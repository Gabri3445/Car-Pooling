"use server"
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { validateRequest, lucia } from "~/server/auth";

export async function signOut(callback: String) {
    const { session } = await validateRequest();
    if (!session) {
        return redirect("error?error=invlogout")
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    if (typeof callback === "string") {
        return redirect(callback, RedirectType.replace);
    }
    return redirect("/");
}