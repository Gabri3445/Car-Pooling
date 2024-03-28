import { db } from "~/server/db";
import DriverProfile, { DriverProfileProps } from "../Profile/DriverProfile";
import Trip, { TripProps } from "../Trip/Trip";
import { validateRequest } from "~/server/auth";


export default async function DriverHomePage() {
    const session = await validateRequest();
    if(session.user) {
        const user = await db.user.findUnique({
            where: {
              id: session.user.id
            },
            select: {
              username: true,
              name: true,
              surname: true,
              driverInfo: {
                select: {
                  profilePic: true,
                  vehicles: {
                    select: {
                      model: true,
                      licensePlate: true
                    },
                    orderBy: {
                      model: "asc"
                    }
                  },
                  trips: {
                    select: {
                      id: true
                    }
                  }
                }
              }
            }
          })
          const ratings = await db.rating.aggregate({
            where: {
              userId: session.user.id
            },
            _avg: {
              star: true
            }
          })
          const trips = await db.trip.findMany({
            where: {
              id: {
                in: user?.driverInfo?.trips.map(t => t.id) ?? []
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
              }
            }
          })
          if(user && ratings) {
            const profileProps: DriverProfileProps = {
              name: user.name,
              surname: user.surname,
              username: user.username,
              pfp: user.driverInfo!.profilePic.toString('base64'),
              vehicles: user.driverInfo!.vehicles,
              rating: ratings._avg.star ?? -1
            };
            const tripProps: TripProps[] = trips.map(t => {
              return {
                pfp: profileProps.pfp,
                username: profileProps.username,
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
                isDriver: true,
                id: t.id,
                rating: t.Ratings.reduce((acc, curr) => acc + curr.star, 0) / t.Ratings.length ?? 0 //average of all ratings, if no ratings return 0
              }
            })
            return(
              <main className="flex flex-col items-center mt-5">
                <h1 className="mb-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Driver Profile</h1>
                <DriverProfile {...profileProps}></DriverProfile>
                <h1 className="mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Users To Accept</h1>
                <h1 className="mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Trips</h1>
                {tripProps.length != 0 && tripProps.map((item, idx) => {
                  if (!trips[idx]?.finished) {
                    return (
                      <Trip key={trips[idx]?.id} {...item} canClose={true}></Trip>
                    )
                  }
                  return null
                })}
                <h1 className="mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Past Trips</h1>
                {tripProps.length != 0 && tripProps.map((item, idx) => {
                  if (trips[idx]?.finished) { //TODO also render a list of all the users to see their rating and leave a rating on the users
                    return (
                      <Trip key={trips[idx]?.id} {...item} canClose={false}></Trip>
                    )
                  }
                  return null
                })}
              </main>
            )
          }
    }
}