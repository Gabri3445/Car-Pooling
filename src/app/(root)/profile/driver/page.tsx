import { captureMessage } from "@sentry/nextjs";
import { redirect } from "next/navigation"
import AddVehicle from "~/components/EditProfile/Driver/AddVehicle";
import RemoveVehicle from "~/components/EditProfile/Driver/RemoveVehicle";
import Nav, { Section } from "~/components/EditProfile/Nav";
import { validateRequest } from "~/server/auth"
import { db } from "~/server/db";

export default async function EditDriverPage() {

    const session = await validateRequest();

    if (session.user == null) {
        captureMessage("User was not signed in when accessing driver edit page", "log")
        redirect(`/signin?callback=${encodeURIComponent("/profile/driver")}`);
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
    });
    const vehicles = await db.vehicle.findMany({
        where: {
            driverInfoId: driverId!.driverInfoId!
        },
        select: {
            licensePlate: true,
            model: true,
            maxPass: true
        }
    })
    const sections: Section[] = [
        {
            id: "#addvehicle",
            title: "Add a vehicle",
        },
        {
            id: "#removevehicle",
            title: "Remove a vehicle",
        }
    ]
    return (
        <div className="flex items-center flex-col w-full px-5">
            <h1 id="top" className="font-bold text-6xl mb-2">Edit your Driver profile</h1>
            <div className="w-full flex">
                <Nav id="#top" title="Edit your Driver profile" sections={sections} />
                <div className="flex-1 w-full ml-4 flex flex-col items-center">
                    <AddVehicle driverId={driverId!.driverInfoId!} />
                    <RemoveVehicle vehicles={vehicles}></RemoveVehicle>
                </div>
            </div>
        </div>
    )
}