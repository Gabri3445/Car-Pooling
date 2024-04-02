import { db } from "~/server/db"
import User from "./User"

interface PastUsersProps {
    tripId: string
}

export default async function PastUsers(props: PastUsersProps) {
    const users = await db.trip.findUnique({
        where: {
            id: props.tripId
        },
        select: {
            Users: {
                select: {
                    id: true,
                    username: true,
                    ratingsGiven: {
                        where: {
                            tripId: props.tripId
                        },
                        select: {
                            desc: true,
                            star: true,
                            id: true
                        }
                    }
                }
            }
        }
    })
    return (
        <div className="w-full flex flex-col mt-1">
            <h1 className="font-bold text-xl text-center mb-1">Users on this trip</h1>
            <div className="mx-5">
            {users?.Users.length != 0 && users?.Users.map((u) => {
                return (
                    <User 
                    key={u.id} 
                    userId={u.id}
                    tripId={props.tripId}
                    username={u.username} 
                    rating={u.ratingsGiven[0]?.star}
                    ratingDesc={u.ratingsGiven[0]?.desc}
                    ></User>
                )
            })}
            </div>
        </div>
    )
}
/*<User 
            username={users!.Users[0]!.username} 
            rating={users!.Users[0]!.ratingsGiven[0]?.star} 
            ratingDesc={users!.Users[0]!.ratingsGiven[0]?.desc}></User>*/