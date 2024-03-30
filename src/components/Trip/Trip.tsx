import { Rating } from "@mui/material"
import { revalidatePath } from "next/cache"
import Image from "next/image"
import Link from "next/link"
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
    isDriver: boolean,
    rating: number,
    id: string,
    userId?: string,
    canClose?: boolean
}

//TODO bunch of stuff

export default function Trip(props: TripProps) {
    return (
        <div className="border rounded-lg p-2 flex items-center w-fit mb-4 last:mb-0"> {/*modal?*/}
            <div className="flex items-center rounded-md border mr-5 p-2">
                <div className="flex flex-col items-center mr-5">
                    <div className="rounded-full border-4 z-10 w-fit bg-white overflow-hidden bg-text/50">
                        <Image width={64} height={64} alt="Profile Picture" src={`data:image/png;base64,${props.pfp}`}></Image>
                    </div>
                    <Rating className="mt-2" readOnly={props.isDriver || props.canReserve}></Rating>
                </div>
                <div className="flex flex-col p-2">
                    <Link href={`/user/${props.username}`}>{props.username}</Link>
                    <span className="font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">{props.model}</span>
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
            {props.canReserve && <form action={reserveTrip.bind(null, props.id, props.userId!)} className="flex items-center"><button className="bg-accent p-3 rounded-md cursor-pointer">Reserve</button></form>}
            {props.canClose && <form action={closeTrip.bind(null, props.id)} className="flex items-center"><button className="bg-accent p-3 rounded-md cursor-pointer">Close</button></form>}
        </div>
    )
}

//TODO when making the passenger side: either make this a client component or make the rating it's own client component
async function closeTrip(id: string) {
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

async function reserveTrip(tripId: string, userId: string) {
    "use server"
    await db.trip.update({
        where: {
            id: tripId
        },
        data: {
            UsersToAccept: {
                connect: {
                    id: userId
                }
            }
        }
    })
    revalidatePath("/")
    revalidatePath("/search")
}