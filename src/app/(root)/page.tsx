import DriverProfile, { DriverProfileProps } from "~/components/Profile/DriverProfile";
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
    if(user && ratings) {
      const profileProps: DriverProfileProps = {
        name: user.name,
        surname: user.surname,
        username: user.username,
        pfp: user.driverInfo!.profilePic.toString('base64'),
        vehicles: user.driverInfo!.vehicles,
        rating: ratings._avg.star ?? -1
      };
      return(
        <main className="flex flex-col items-center mt-5">
          <h1 className="mb-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Driver Profile</h1>
          <DriverProfile {...profileProps}></DriverProfile>
          <h1 className="mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Trips</h1>
          <h1 className="mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Users To Accept</h1>
        </main>
      )
    }
  }
}
