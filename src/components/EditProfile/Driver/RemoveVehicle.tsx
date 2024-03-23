import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

interface RemoveVehicleProps {
    vehicles: Vehicle[]
}

interface Vehicle {
    licensePlate: string,
    model: string,
    maxPass: number
}


export default function RemoveVehicle(props: RemoveVehicleProps) {
    return (
        <div id="removevehicle" className="w-2/3 my-auto">
            <h1 className="font-bold text-4xl">Remove a vehicle</h1>
            <form action={removeVehicle}>
                <div className="relative overflow-x-auto shadow-md ">
                    <table className="w-full text-sm border sm:rounded-lg  text-left rtl:text-right text-text dark:text-text">
                        <thead className="text-xs text-text uppercase bg-background dark:bg-background dark:text-text">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    License Plate
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Model
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Maximum amount of passengers
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.vehicles.map((item) => {
                                return (
                                    <tr key={item.licensePlate} className="bg-background border-b dark:bg-background border hover:bg-background dark:hover:bg-background">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input name="vehicle" value={item.licensePlate} id="checkbox-table-1" type="checkbox" className="w-4 h-4 text-text bg-background border rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-background dark:border" />
                                                <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-text whitespace-nowrap dark:text-white">
                                            {item.licensePlate}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.model}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.maxPass}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="w-full flex mt-3 flex-row-reverse">
                        <input className="bg-accent p-3 w-20 rounded-md cursor-pointer" type="submit" value="Remove" />
                    </div>
                </div>
            </form>
        </div>
    )
}

const removeVehicle = async (formData: FormData) => {
    "use server"
    const licensePlates = formData.getAll("vehicle") as string[]
    if (licensePlates.length == 0) {
        return;
    }
    await db.vehicle.deleteMany({
        where: {
            licensePlate: {
                in: licensePlates
            }
        }
    })
    revalidatePath('/')
    revalidatePath('/profile/driver')
}