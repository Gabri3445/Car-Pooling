import { validateRequest } from "~/server/auth";
import PassengerProfile, { PassengerProfileProps } from "../Profile/PassengerProfile"
import { db } from "~/server/db";
import Trip, { TripProps } from "../Trip/Trip";

export default async function PassengerHomePage() {
  const session = await validateRequest();
  if (session.user) {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        username: true,
        name: true,
        surname: true,
        trips: {
          select: {
            id: true
          }
        },
        reservedTrips: {
          select: {
            id: true
          }
        }
      }
    })
    const ratings = await db.rating.aggregate({
      where: {
        ToUserId: session.user.id
      },
      _avg: {
        star: true
      }
    })
    const participatingTrips = await db.trip.findMany({
      where: {
        id: {
          in: user!.trips.map(t => t.id)
        }
      },
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
        finished: true,
        Ratings: true,
        cost: true,
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
    const reservedTrips = await db.trip.findMany({
      where: {
        id: {
          in: user!.reservedTrips.map(t => t.id)
        }
      },
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
        finished: true,
        Ratings: true,
        cost: true,
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
    if (user && ratings && participatingTrips && reservedTrips) {
      const passengerProfileProps: PassengerProfileProps = {
        username: user.username,
        name: user.name,
        surname: user.surname,
        rating: ratings._avg.star ?? -1
      }
      const participatingTripsProps: TripProps[] = participatingTrips.map(t => {
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
          rating: t.Ratings.reduce((acc, curr) => acc + curr.star, 0) / t.Ratings.length ?? 0 //average of all ratings, if no ratings return 0
        }
      })
      const reservedTripsProps: TripProps[] = reservedTrips.map(t => {
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
          canReserve: true,
          isDriver: false,
          id: t.id,
          rating: t.Ratings.reduce((acc, curr) => acc + curr.star, 0) / t.Ratings.length ?? 0 //average of all ratings, if no ratings return 0
        }
      })
      return (
        <main className="flex items-center m-5 justify-between">
          <div className="flex items-center flex-col">
            <h1 className="text-center mb-5 leading-normal text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Passenger Profile</h1>
            <PassengerProfile {...passengerProfileProps}></PassengerProfile>
            {/*TODO: add some recent reviews*/}
          </div>
          <div className="grow m-6">
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Trips</h1>
            <div className="flex flex-col items-center">
              {participatingTripsProps.length != 0 && participatingTripsProps.map((item, idx) => {
                if (!participatingTrips[idx]?.finished) {
                  return (
                    <Trip key={participatingTripsProps[idx]?.id} {...item} canClose={false}></Trip>
                  )
                }
                return null
              })}
            </div>
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Trips that the driver needs to accept</h1>
            <div className="flex flex-col items-center">
              {reservedTripsProps.length != 0 && reservedTripsProps.map((item, idx) => {
                if (!reservedTrips[idx]?.finished) {
                  return (
                    <Trip key={reservedTripsProps[idx]?.id} {...item} canClose={false}></Trip>
                  )
                }
                return null
              })}
            </div>
            <h1 className="mb-5 mt-5 text-center text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Past Trips</h1>
            <div className="flex flex-col items-center">
            {participatingTripsProps.length != 0 && participatingTripsProps.map((item, idx) => {
                if (participatingTrips[idx]?.finished) {
                  return (
                    <Trip key={participatingTripsProps[idx]?.id} {...item} canRate={true} canClose={false}></Trip>
                  )
                }
                return null
              })}
            </div>
          </div>
        </main>
      )
    }
  }

}