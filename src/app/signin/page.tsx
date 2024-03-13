import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

    const loginInWithCallback = login.bind(null, searchParams.callback ?? "/")
	return (
		<div className="flex w-full items-center justify-center h-screen overflow-hidden flex-col">
			<h1 className="text-4xl mb-4">Sign in</h1>
			<form className="flex flex-col p-6 border-2 rounded-lg" action={loginInWithCallback}>
				<label className="mb-1" htmlFor="username">Username:</label>
				<input className="bg-gray-500 mb-10" name="username" id="username" />
				<label className="mb-1" htmlFor="password mb-2">Password:</label>
				<input className="bg-gray-500 mb-10" type="password" name="password" id="password" />
				<button>Continue</button>
			</form>
		</div>
	);
}

async function login(callback: string | string[], formData: FormData): Promise<ActionResult> {
	"use server";
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username"
		};
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password"
		};
	}

	/*
	const existingUser = await db
		.table("username")
		.where("username", "=", username.toLowerCase())
		.get();
		*/
	const existingUser = await db.user.findUnique({
		where: {
			username: username
		}
	})
	if (!existingUser) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid usernames from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid usernames.
		// However, valid usernames can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is none-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
		// If usernames are public, you may outright tell the user that the username is invalid.
		return {
			error: "Incorrect username or password"
		};
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);
	if (!validPassword) {
		return {
			error: "Incorrect username or password"
		};
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	if (typeof callback === "string") {
		return redirect(callback);
	}
	return redirect("/");
}

interface ActionResult {
	error: string;
}