import { redirect } from "next/navigation"
import { validateRequest } from "~/server/auth"

export default async function EditDriverPage() {
    
    const session = await validateRequest();

    if (session.user == null) {
        redirect("/signin?callback=./profile/driver");
    } 
    if (session.user.role != "DRIVER") {
        redirect("/");
    }
    return (
        <div>
            <h1>Edit Driver</h1>
        </div>
    )
}