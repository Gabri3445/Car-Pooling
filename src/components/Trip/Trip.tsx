import { revalidatePath } from "next/cache"
import Image from "next/image"
import { db } from "~/server/db"

export interface TripProps {
    pfp: string
    username: string,
    model: string,
    maxPass: number,
    depCity: string,
    arrCity: string,
    depTime: string,
    estArrTime: string,
    cost: number
    users: number,
    note: string,
    canReserve: boolean,
    id: string
    canClose?: boolean
}

//TODO bunch of stuff

export default function Trip(props: TripProps) {
    return (
        <div className="border rounded-lg p-2 flex items-center"> {/*modal?*/}
            <div className="flex items-center rounded-md border mr-5 p-2">
                <div className="rounded-full border-4 z-10 w-fit bg-white overflow-hidden bg-text/50 mr-5">
                    <Image width={64} height={64} alt="Profile Picture" src={`data:image/png;base64,${props.pfp}`}></Image>
                </div>
                <div className="flex flex-col p-2">
                    <span>{props.username}</span> {/*make this a link*/}
                    <span>{props.model}</span>
                </div>
            </div>
            <div className="flex flex-col mr-5">
                <div className="flex flex-col">
                    <span>Departure City: {props.depCity}</span>
                    <span>Arrival City: {props.arrCity}</span>
                </div>
                <div className="flex flex-col">
                    <span>Departure Time: {props.depTime}</span>
                    <span>Estimated Arrival Time: {props.estArrTime}</span>
                </div>
            </div>
            <div className="flex flex-col mr-5">
                <div className="flex flex-col">
                    <span>Cost: {props.cost}€</span>
                </div>
                <div className="flex flex-col">
                    <span>Users on this trip: {props.users}/{props.maxPass}</span>
                </div>
            </div>
            <div className="flex flex-col mr-5">
                <div className="flex flex-col">
                    <span>Note:</span>
                    {props.note == "" ? "No note" : <div className="h-20 w-72 overflow-auto bg-secondary rounded-md text-justify">{props.note}</div>}
                </div>
            </div>
            {props.canReserve && <div className="flex items-center"><button className="bg-accent p-3 rounded-md cursor-pointer">Reserve</button></div>}
            {props.canClose && <form action={CloseTrip.bind(null, props.id)} className="flex items-center"><button className="bg-accent p-3 rounded-md cursor-pointer">Close</button></form>}
        </div>
    )
}

async function CloseTrip(id :string) {
    "use server"
    await db.trip.update({
        where: {
            id: id
        },
        data: {
            finished: true
        }
    })
    revalidatePath("/")
}