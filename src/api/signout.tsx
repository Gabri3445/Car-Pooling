"use server"
import { captureMessage } from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest, lucia } from "~/server/auth";

export async function signOut() {
	const { session } = await validateRequest();
	if (!session) {
		captureMessage("User was not logged in when logging out", "warning")
		return redirect("error?error=invlogout")
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	revalidatePath("/")
	return redirect("/");
}