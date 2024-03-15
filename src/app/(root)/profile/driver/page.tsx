import { redirect } from "next/navigation"
import { validateRequest } from "~/server/auth"

export default async function EditDriverPage() {
    
    const session = await validateRequest();

    if (session.user == null) {
        redirect("signin");
    } 
    if (session.user.role != "driver") {
        redirect("/");
    }
    return (
        <div>
            <h1>Edit Driver</h1>
        </div>
    )
}