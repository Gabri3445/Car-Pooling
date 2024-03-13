import { lucia, validateRequest } from "~/server/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const logoutWithCallback = logout.bind(null, searchParams.callback ?? "/")
	return (
		<div className="flex w-full items-center justify-center h-screen overflow-hidden flex-col">
			<h1 className="text-4xl mb-4">Sign Out</h1>
			<form className="flex flex-col p-6 border-2 rounded-lg mb-4 bg-white/15" action={logoutWithCallback}>
				<button className="text-blue-500 text-3xl">Continue</button>
			</form>
		</div>
	);
}

async function logout(callback: string | string[]) {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		return redirect("/error?error=invlogout")
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	if (typeof callback === "string") {
		return redirect(callback);
	}
	return redirect("/");
}