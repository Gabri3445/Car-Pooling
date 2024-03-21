import { db } from "~/server/db"

export default async function AddVehicle(props: { driverId: string }) {
    /*
    licensePlate String      @id
  model        String
  maxPass      Int
    */

    return (
        <div id="addvehicle" className="w-2/3 my-auto">
            <h1 className="font-bold text-4xl">Add a Vehicle</h1>
            <form action={addVehicle.bind(null, props.driverId)} className="flex flex-col">
                <label className="mb-1" htmlFor="licensePlateAdd">License Plate:</label>
                <input type="text" name="licensePlate" id="licensePlateAdd" className="bg-secondary mb-2 rounded-md" />
                <label className="mb-1" htmlFor="modelAdd">Model:</label>
                <input type="text" name="model" id="modelAdd" className="bg-secondary mb-2 rounded-md" />
                <label className="mb-1" htmlFor="maxPass">Max amount of passengers:</label>
                <input type="number" name="maxPass" id="maxPass" className="bg-secondary mb-2 rounded-md" />
                <div className="w-full flex mt-3 flex-row-reverse">
                    <input className="bg-accent p-3 w-20 rounded-md cursor-pointer" type="submit" value="Add" />
                </div>
            </form>
        </div>
    )
}

async function addVehicle(id: string, formData: FormData) {
    "use server"
    const vehicle = {
        licensePlate: formData.get("licensePlate") as string,
        model: formData.get("model") as string,
        maxPass: formData.get("maxPass") as unknown as number
    }
    if (typeof vehicle.maxPass !== "number") {
        return {
            error: "maxPass must be a number"
        }
    }
    const user = await db.user.findUnique({
        where: {
            id: id
        }
    })
    if (!user) {
        return {
            error: "User not found"
        }
    }
    const vehicleExists = await db.vehicle.findFirst({
        where: {
            licensePlate: vehicle.licensePlate
        }
    })
    if (vehicleExists) {
        return {
            error: "Vehicle already exists"
        }
    }
    await db.vehicle.create({
        data: {
            licensePlate: vehicle.licensePlate,
            maxPass: vehicle.maxPass,
            model: vehicle.model,
            DriverInfo: {
                connect: {
                    id: id
                }
            }
        }
    })
}