import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "~/server/auth"
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { generateId } from "lucia";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { captureException, getCurrentScope } from "@sentry/nextjs";

export default async function DriverSignUpPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

	const signUpWithCallback = signup.bind(null, searchParams.callback ?? "/")

	return (
		<div className="flex w-full items-center justify-center h-screen overflow-hidden flex-col">
			<h1 className="text-4xl mb-4">Create a Driver account</h1>
			<form className="flex flex-col p-6 bg-primary/50 border-2 rounded-lg mb-4" action={signUpWithCallback}>
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
				<label className="mb-1" htmlFor="pfp">Profile Image:</label>
				<input className="bg-secondary mb-2 rounded-md" type="file" accept="image/*" name="pfp" id="pfp" required />
				<label className="mb-1" htmlFor="password">Password:</label>
				<input className="bg-secondary mb-2 rounded-md" type="password" name="password" id="password" required />
				<button>Continue</button>
			</form>
			<div className="mb-6"><Link className="text-blue-500 bg-accent p-3 rounded-md" href="/signup">Go to Passenger Sign Up</Link></div>
			<div><Link className="text-blue-500 bg-accent p-3 rounded-md" href="/signin">Go to Sign In</Link></div>
		</div>
	);
}

async function signup(callback: string | string[], formData: FormData): Promise<ActionResult> {
	"use server";
	//const username = formData.get("username");
	const user = {
		username: formData.get("username")!,
		name: formData.get("name"),
		surname: formData.get("surname"),
		email: formData.get("email"),
		tel: formData.get("tel"),
		pfp: formData.get("pfp") as File,
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
	//const password = formData.get("password");
	if (typeof user.password !== "string" || user.password.length < 4 || user.password.length > 255) {
		return {
			error: "Invalid password"
		};
	}


	const hashedPassword = await new Argon2id().hash(user.password);
	const userId = generateId(15);

	// TODO: check if username is already used

	try {
		const result = await db.user.create({
			data: {
				id: userId,
				password: hashedPassword,
				role: "DRIVER",
				name: user.name,
				surname: user.surname,
				email: user.email,
				phoneNumber: user.tel,
				username: user.username,
				driverInfo: {
					create: {
						profilePic: Buffer.from(await user.pfp.arrayBuffer()) //toString('base64') to read
					}
				}
			}
		})
	} catch (e) {
		getCurrentScope().setLevel("warning")
		captureException(e)
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