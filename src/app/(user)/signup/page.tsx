import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "~/server/auth"
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { generateId } from "lucia";
import Link from "next/link";
import Error from "~/components/Error/Error";
import { captureException, getCurrentScope } from "@sentry/nextjs";

export default async function PassSignUpPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

	const signUpWithCallback = signup.bind(null, searchParams.callback as string | null ?? "/")
	const error = searchParams.error as string | null

	return (
		<div className="flex w-full h-screen items-center justify-center flex-col">
			<h1 className="text-4xl mb-4">Create a Passenger account</h1>
			<form className="flex flex-col p-6 border-2 rounded-lg mb-4 bg-primary/50" action={signUpWithCallback}>
				{error && <Error message={error}></Error>}
				<label className="mb-1" htmlFor="username">Username (between 4 and 31 characters):</label>
				<input className="bg-secondary mb-2 rounded-md" name="username" id="username" required />
				<label className="mb-1" htmlFor="name">Name:</label>
				<input className="bg-secondary mb-2 rounded-md" name="name" id="name" required />
				<label className="mb-1" htmlFor="surname">Surname:</label>
				<input className="bg-secondary mb-2 rounded-md" name="surname" id="surname" required />
				<label className="mb-1" htmlFor="email">Email:</label>
				<input className="bg-secondary mb-2 rounded-md" type="email" name="email" id="email" required />
				<label className="mb-1" htmlFor="tel">Phone number:</label>
				<input className="bg-secondary mb-2 rounded-md" type="tel" name="tel" id="tel" required />
				<label className="mb-1" htmlFor="id">ID Card:</label>
				<input className="mb-2 bg-secondary rounded-md" name="id" id="id" required />
				<label className="mb-1" htmlFor="password">Password:</label>
				<input className="bg-secondary mb-2 rounded-md" type="password" name="password" id="password" required />
				<button>Continue</button>
			</form>
			<div className="mb-6"><Link className="text-blue-500 bg-accent p-3 rounded-md" href={`/signup/driver?${searchParams.callback ? `callback=${encodeURIComponent(searchParams.callback as string)}` : ""}`}>Go to Driver Sign Up</Link></div>
			<div><Link className="text-blue-500 bg-accent p-3 rounded-md" href={`/signin?${searchParams.callback ? `callback=${encodeURIComponent(searchParams.callback as string)}` : ""}`}>Go to Sign In</Link></div>
		</div>
	);
}

async function signup(callback: string, formData: FormData): Promise<ActionResult> {
	"use server";
	//const username = formData.get("username");
	//const username = formData.get("username");
	const decodedCallback = decodeURIComponent(callback)
	const user = {
		username: formData.get("username")!,
		name: formData.get("name"),
		surname: formData.get("surname"),
		email: formData.get("email"),
		tel: formData.get("tel"),
		id: formData.get("id"),
		password: formData.get("password")
	}
	// username must be between 4 ~ 31 characters, and only consists of letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof user.username !== "string" ||
		user.username.length < 3 ||
		user.username.length > 31 ||
		!/^[a-zA-Z0-9_-]+$/.test(user.username)
	) {
		return {
			error: "Invalid username"
		};
	}
	if (user.username.toLowerCase() == "driver" || user.username.toLowerCase() == "passenger") {
		redirect(`/signin?callback=${encodeURIComponent(callback)}&error=${encodeURIComponent("Username cannot be driver or passenger")}`)
		return {
			error: "Invalid username"
		};
	}
	if (typeof user.name !== "string") {
		return {
			error: "Invalid name"
		};
	}
	if (typeof user.surname !== "string") {
		return {
			error: "Invalid surname"
		};
	}
	if (typeof user.email !== "string") {
		return {
			error: "Invalid email"
		};
	}
	if (typeof user.tel !== "string") {
		return {
			error: "Invalid phone number"
		};
	}
	if (typeof user.id !== "string") {
		return {
			error: "Invalid ID"
		};
	}
	//const password = formData.get("password");
	if (typeof user.password !== "string" || user.password.length < 4 || user.password.length > 255) {
		return {
			error: "Invalid password"
		};
	}


	const hashedPassword = await new Argon2id().hash(user.password);
	const userId = generateId(15);

	try {
		const result = await db.user.create({
			data: {
				id: userId,
				password: hashedPassword,
				role: "PASSENGER",
				name: user.name,
				surname: user.surname,
				email: user.email,
				phoneNumber: user.tel,
				username: user.username,
				idCard: user.id
			}
		})
	} catch (e) {
		getCurrentScope().setLevel("warning")
		captureException(e)
		redirect(`/signin?callback=${encodeURIComponent(callback)}&error=${encodeURIComponent("User already exists with one of the unique fields eg. Password, email, license etc.")}`)
		// The .code property can be accessed in a type-safe manner
		return redirect("/error?error=unique")
	}



	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	console.log(callback)
	if (typeof callback === "string") {
		return redirect(decodeURIComponent(callback));
	}
	return redirect("/")
}

interface ActionResult {
	error: string;
}