import { db } from "~/server/db";
import DriverProfile, { DriverProfileProps } from "../Profile/DriverProfile";
import Trip, { TripProps } from "../Trip/Trip";
import { validateRequest } from "~/server/auth";
import ReservedUser, { ReservedUserProps } from "./Driver/ReservedUser";


export default async function DriverHomePage() {
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
        ToUserId: session.user.id
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
        },
        UsersToAccept: {
          select: {
            username: true,
            id: true
          }
        }
      }
    })
    if (user && ratings) {
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
      const reservedUserProps: ReservedUserProps[] = trips.flatMap(t => {
        return t.UsersToAccept.map(u => ({
          username: u.username,
          depCity: t.depCity,
          arrCity: t.arrCity,
          depTime: t.depTime,
          estArrTime: t.estArrTime,
          users: t._count.Users,
          maxPass: Number(t.vehicle.maxPass),
          userId: u.id,
          driverId: session.user.id,
          tripId: t.id
        }))
      })
      return (
        <main className="flex m-5 items-start">
          <div className="flex items-center flex-col">
            <h1 className="text-center mb-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Driver Profile</h1>
            <DriverProfile {...profileProps}></DriverProfile>
            {/*TODO: add some recent reviews*/}
          </div>
          <div className="grow m-6">
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Users To Accept</h1>
            <div className="flex flex-col items-center">
              {reservedUserProps.length != 0 && reservedUserProps.map((item) => {
                return (
                  <ReservedUser {...item}></ReservedUser>
                )
              })}
            </div>
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Trips</h1>
            <div className="flex flex-col items-center">
              {tripProps.length != 0 && tripProps.map((item, idx) => {
                if (!trips[idx]?.finished) {
                  return (
                    <Trip key={trips[idx]?.id} {...item} canClose={true}></Trip>
                  )
                }
                return null
              })}
            </div>
            <h1 className="mb-5 mt-5 text-center text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Past Trips</h1>
            <div className="flex flex-col items-center">
              {tripProps.length != 0 && tripProps.map((item, idx) => {
                if (trips[idx]?.finished) {
                  return (
                    <Trip key={trips[idx]?.id} {...item} canClose={false}></Trip>
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