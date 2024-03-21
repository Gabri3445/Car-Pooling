import { captureMessage } from "@sentry/nextjs";
import { redirect } from "next/navigation"
import AddVehicle from "~/components/EditProfile/Driver/AddVehicle";
import { validateRequest } from "~/server/auth"
import { db } from "~/server/db";

export default async function EditDriverPage() {

    const session = await validateRequest();

    if (session.user == null) {
        captureMessage("User was not signed in when accessing driver edit page", "log")
        redirect("/signin?callback=/profile/driver");
    }
    if (session.user.role != "DRIVER") {
        captureMessage("User was not a driver when accessing driver edit page", "log")
        redirect("/");
    }
    const driverId = await db.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            driverInfoId: true
        }
    })
    return (
        <div className="flex items-center flex-col">
            <h1 className="font-bold text-6xl mb-2">Edit Driver</h1>
            <AddVehicle driverId={driverId!.driverInfoId!} />
        </div>
    )
}