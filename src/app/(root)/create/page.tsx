import { captureMessage } from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"
import { validateRequest } from "~/server/auth"
import { db } from "~/server/db";

export default async function CreatePage() {

    const session = await validateRequest();

    if (session.user == null) {
        captureMessage("User was not signed in when accessing trip creation page", "log")
        redirect(`/signin?callback=${encodeURIComponent("/profile/driver")}`);
    }
    if (session.user.role != "DRIVER") {
        captureMessage("User was not a driver when accessing trip creation page", "log")
        redirect("/");
    }
    const driver = await db.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            driverInfo: {
                select: {
                    id: true,
                    vehicles: {
                        select: {
                            licensePlate: true,
                            model: true
                        }
                    }
                },
            }
        }
    })

    return (
        <div className="flex w-full items-center justify-center h-screen overflow-hidden flex-col">
            <h1 className="text-4xl mb-4">Create a trip</h1>
            <form action={createTrip.bind(null, driver!.driverInfo!.id)} className="flex flex-col p-6 border-2 rounded-lg mb-4 bg-primary/50">
                <label className="mb-1" htmlFor="depCity">Departing City:</label>
                <input className="bg-secondary mb-2 rounded-md" name="depCity" id="depCity" required />
                <label className="mb-1" htmlFor="arrCity">Arriving City:</label>
                <input className="bg-secondary mb-2 rounded-md" name="arrCity" id="arrCity" required />
                <label className="mb-1" htmlFor="depDate">Departing Time:</label>
                <input className="bg-secondary mb-2 rounded-md" name="depDate" id="depDate" required />
                <label className="mb-1" htmlFor="arrDate">Est. Arriving Time:</label>
                <input className="bg-secondary mb-2 rounded-md" name="arrDate" id="arrDate" required />
                <label className="mb-1" htmlFor="cost">Cost:</label>
                <input className="bg-secondary mb-2 rounded-md" name="cost" id="cost" required />
                <label className="mb-1" htmlFor="vehicle">Vehicle:</label>
                <select required defaultValue={"default"} id="vehicle" name="vehicle" className="bg-secondary border border-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="default">Choose one of your vehicles</option>
                    {driver!.driverInfo!.vehicles.map((item) => {
                        return (
                            <option key={item.licensePlate} value={item.licensePlate} >{item.model}</option>
                        )
                    })}
                </select>
                <label className="mb-1" htmlFor="note">Note:</label>
                <textarea className="bg-secondary mb-2 rounded-md max-h-32 min-h-6" name="note" id="note"></textarea>
                <button>Continue</button>
            </form>
        </div>
    )
}

//<input className="bg-secondary mb-2 rounded-md" name="note" id="note" />

const createTrip = async (id: string, formData: FormData) => {
    "use server"
    const trip = {
        depCity: formData.get("depCity") as string,
        arrCity: formData.get("arrCity") as string,
        depTime: formData.get("depDate") as string,
        arrTime: formData.get("arrDate") as string,
        cost: Number(formData.get("cost")),
        vehicleLicense: formData.get("vehicle") as string,
        note: formData.get("note") as string,
    }
    await db.trip.create({
        data: {
            depCity: trip.depCity,
            arrCity: trip.arrCity,
            depTime: trip.depTime,
            estArrTime: trip.arrTime,
            cost: trip.cost,
            vehicleLicensePlate: trip.vehicleLicense,
            driverInfoId: id
        }
    })
    revalidatePath("/")
    redirect("/")
}