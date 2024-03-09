import { lucia, validateRequest } from "~/server/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const logoutWithCallback = logout.bind(null, searchParams.callback ?? "/")
	return (
		<form action={logoutWithCallback}>
			<button>Sign out</button>
		</form>
	);
}

async function logout(callback: string | string[]) {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	if (typeof callback === "string") {
		return redirect(callback);
	}
	return redirect("/");
}