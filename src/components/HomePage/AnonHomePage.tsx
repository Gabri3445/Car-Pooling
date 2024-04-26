import { db } from "~/server/db"
import Trip, { TripProps } from "../Trip/Trip"

export default async function AnonHomePage() {
    const trips = await db.trip.findMany({
        select: {
            id: true,
            vehicle: {
                select: {
                    maxPass: true,
                    model: true
                }
            },
            depCity: true,
            arrCity: true,
            depTime: true,
            estArrTime: true,
            note: true,
            _count: {
                select: {
                    Users: true
                }
            },
            date: true,
            finished: true,
            Ratings: true,
            cost: true,
            DriverInfo: {
                select: {
                    profilePic: true,
                    User: {
                        select: {
                            username: true,
                            id: true
                        }
                    }
                }
            }
        }
    })

    const tripsProps: TripProps[] = trips.map(t => {
        return {
            pfp: t.DriverInfo.profilePic.toString('base64'),
            username: t.DriverInfo.User!.username,
            model: t.vehicle.model,
            maxPass: t.vehicle.maxPass,
            depCity: t.depCity,
            arrCity: t.arrCity,
            depTime: t.depTime,
            estArrTime: t.estArrTime,
            cost: Number(t.cost),
            note: t.note ?? "",
            users: t._count.Users,
            canReserve: false,
            isDriver: false,
            id: t.id,
            date: t.date,
            rating: t.Ratings.reduce((acc, curr) => acc + curr.star, 0) / t.Ratings.length ?? 0 //average of all ratings, if no ratings return 0
        }
    })

    return (
        <main className="flex flex-col m-5 items-start justify-center">
            <h1 className="text-center w-full mb-5 leading-normal text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Please sign in or sign up to reserve or create trips</h1>
            <div className="w-full">
                {tripsProps.length == 0 ? null :
                    <>
                        <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">All Trips</h1>
                        <div className="flex flex-col items-center">
                            {tripsProps.length != 0 && tripsProps.map((item, idx) => {
                                if (!trips[idx]?.finished) {
                                    return (
                                        <Trip key={trips[idx]?.id} {...item} canClose={false} canRate={false} ></Trip>
                                    )
                                }
                                return null
                            })}
                        </div>
                    </>
                }
            </div>
        </main>
    )
}