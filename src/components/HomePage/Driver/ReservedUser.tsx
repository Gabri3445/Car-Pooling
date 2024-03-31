import { Button, Rating } from "@mui/material";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { db } from "~/server/db";

export interface ReservedUserProps {
    username: string,
    depCity: string,
    arrCity: string,
    depTime: string,
    estArrTime: string,
    users: number,
    maxPass: number,
    userId: string,
    driverId: string,
    tripId: string
}

export default async function ReservedUser(props: ReservedUserProps) {
    return (
        <div className="border rounded-lg p-2 flex items-center w-fit mb-4 last:mb-0"> {/*modal?*/}
            <div className="flex items-center rounded-md border mr-5 p-2">
                <div className="flex flex-col items-center">
                    <Rating className="mb-2" readOnly></Rating>
                    <Link className="text-text" href={`/user/${props.username}`}>{props.username}</Link>
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
                    <span>Users on this trip: {props.users}/{props.maxPass}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <form action={acceptUser.bind(null, props.userId, props.driverId, props.tripId)}><button className="bg-accent p-3 rounded-md mb-2 cursor-pointer">Accept User</button></form>
                    <form action={refuseUser.bind(null, props.userId, props.driverId, props.tripId)}><button className="bg-secondary p-3 rounded-md cursor-pointer">Refuse User</button></form>
                </div>
            </div>
        </div>
    )
}

async function acceptUser(userId: string, driverId: string, tripId: string) {
    "use server"
    await db.trip.update({
        where: {
            id: tripId
        },
        data: {
            UsersToAccept: {
                disconnect: {
                    id: userId
                }
            },
            Users: {
                connect: {
                    id: userId
                }
            }
        }
    })
    revalidatePath("/")
    revalidatePath("/search")
}

async function refuseUser(userId: string, driverId: string, tripId: string) {
    "use server"
    await db.trip.update({
        where: {
            id: tripId
        },
        data: {
            UsersToAccept: {
                disconnect: {
                    id: userId
                }
            }
        }
    })
    revalidatePath("/")
    revalidatePath("/search")
}