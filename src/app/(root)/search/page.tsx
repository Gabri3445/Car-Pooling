import { redirect } from "next/navigation";
import Trip, { TripProps } from "~/components/Trip/Trip";
import { validateRequest } from "~/server/auth";
import { db } from "~/server/db";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const from = searchParams.from;
    const to = searchParams.to;
    if((!from || !to) && typeof from != "string" && typeof to != "string") {
        redirect("/")
    }
    const session = await validateRequest();
    const trips = await db.trip.findMany({
        where: {
          depCity: {
            contains: from as string
          },
          arrCity: {
            contains: to as string
          }
        },
        select: {
          arrCity: true,
          depCity: true,
          depTime: true,
          estArrTime: true,
          cost: true,
          id: true,
          _count: {
            select: {
              Users: true
            }
          },
          finished: true,
          note: true,
          vehicle: {
            select: {
              maxPass: true,
              model: true
            }
          },
          Ratings: {
            select: {
              star: true
            }
          },
          DriverInfo: {
            select: {
                profilePic: true,
                User: {
                    select: {
                        username: true
                    }
                }
            }
          }
        }
      })
    const tripProps: TripProps[] = await Promise.all(trips.map(async t => {
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
          canReserve: await canReserve(session.user!.role, session.user!.id, t.id), // only if the user is a pass and has not already reserved the trip or is on the trip
          isDriver: session.user?.role == "DRIVER",
          id: t.id,
          rating: t.Ratings.reduce((acc, curr) => acc + curr.star, 0) / t.Ratings.length ?? 0, //average of all ratings, if no ratings return 0
          canClose: false
        }
      }))
    return (
        <main>
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">All the trips we found from {from} to {to}</h1>
            <div className="flex flex-col items-center">
            {tripProps.length != 0 && tripProps.map((item, idx) => {
                if (!trips[idx]?.finished) {
                  return (
                    <Trip key={trips[idx]?.id} {...item} userId={session.user!.id}></Trip>
                  )
                }
                return null
              })}
            </div>
        </main>
    )
}

async function canReserve(role: string, userId: string, tripId: string): Promise<boolean> {
    if(role == "DRIVER") {
        return false;
    }
    const trip = await db.trip.findUnique({
        where: {
            id: tripId
        },
        select: {
            Users: {
                select: {
                    id: true
                }
            },
            UsersToAccept: {
                select: {
                    id: true
                }
            }
        }
    })
    for(const user of trip?.Users ?? []) {
        if(user.id == userId) {
            return false;
        }
    }
    for(const user of trip?.UsersToAccept ?? []) {
        if(user.id == userId) {
            return false;
        }
    }
    return true
}