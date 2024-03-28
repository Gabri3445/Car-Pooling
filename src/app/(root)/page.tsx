import DriverHomePage from "~/components/HomePage/DriverHomePage";
import { validateRequest } from "~/server/auth";

export default async function HomePage() {
  const session = await validateRequest();
  if(session.user?.role == "DRIVER") {
    return <DriverHomePage></DriverHomePage>
  }
  return null
}