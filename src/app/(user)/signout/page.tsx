import { lucia, validateRequest } from "~/server/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { captureMessage } from "@sentry/nextjs";

/**
 * @deprecated Use the server action
 */
export default async function SignOutPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const logoutWithCallback = logout.bind(null, searchParams.callback ?? "/")
	
	throw new Error("Deprecated. Use the server action", )

	return (
		<div className="flex w-full items-center justify-center h-screen overflow-hidden flex-col">
			<h1 className="text-4xl mb-4">Sign Out</h1>
			<form className="flex flex-col p-6 border-2 rounded-lg mb-4 bg-accent" action={logoutWithCallback}>
				<button className="text-blue-50 text-3xl">Continue</button>
			</form>
		</div>
	);
}

async function logout(callback: string | string[]) {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		captureMessage("User was not logged in when logging out", "warning")
		return redirect("error?error=invlogout")
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	if (typeof callback === "string") {
		return redirect(decodeURIComponent(callback));
	}
	return redirect("/");
}