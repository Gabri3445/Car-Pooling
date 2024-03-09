import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "~/server/auth"
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { generateId } from "lucia";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

	const signUpWithCallback = signup.bind(null, searchParams.callback ?? "/")

	return (
		<>
			<h1>Create an account</h1>
			<form action={signUpWithCallback}>
				<label htmlFor="username">Username</label>
				<input className="bg-gray-500" name="username" id="username" />
				<br />
				<label htmlFor="password">Password</label>
				<input className="bg-gray-500" type="password" name="password" id="password" />
				<br />
				<button>Continue</button>
			</form>
		</>
	);
}

async function signup(callback: string | string[], formData: FormData): Promise<ActionResult> {
	"use server";
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
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

	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);

	// TODO: check if username is already used
	await db.user.create({
		data: {
			id: userId,
			password: hashedPassword,
			username: username
		}
	})

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	console.log(callback)
	if (typeof callback === "string") {
		return redirect(callback);
	}
	return redirect("/")
}

interface ActionResult {
	error: string;
}