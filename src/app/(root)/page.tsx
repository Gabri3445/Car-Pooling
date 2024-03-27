import DriverProfile, { DriverProfileProps } from "~/components/Profile/DriverProfile";
import Trip, { TripProps } from "~/components/Trip/Trip";
import { validateRequest } from "~/server/auth";
import { db } from "~/server/db";

export default async function HomePage() {

  const session = await validateRequest();

  if(session.user?.role == "DRIVER") {
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
          driver: true
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
                <Trip key={trips[idx]?.id} {...item}></Trip>
              )
            }
            return null
          })}
          <h1 className="mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Past Trips</h1>
          {tripProps.length != 0 && tripProps.map((item, idx) => {
            if (trips[idx]?.finished) {
              return (
                <Trip key={trips[idx]?.id} {...item}></Trip>
              )
            }
            return null
          })}
        </main>
      )
    }
  }
}

/*pfp={profileProps.pfp} username={profileProps.username} model="example" arrCity="example" depCity="example" 
          depTime="10:00" estArrTime="12:00" cost={20} maxPass="4" users={2}*/
/*
export interface TripProps {
    pfp: string
    username: string,
    model: string,
    maxPass: string,
    depCity: string,
    arrCity: string,
    depTime: string,
    estArrTime: string,
    cost: number
    users: number,
    driver: boolean
}
*/