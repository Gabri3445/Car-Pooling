import AnonHomePage from "~/components/HomePage/AnonHomePage";
import DriverHomePage from "~/components/HomePage/DriverHomePage";
import PassengerHomePage from "~/components/HomePage/PassengerHomePage";
import { validateRequest } from "~/server/auth";

export default async function HomePage() {
  const session = await validateRequest();
  if(session.user?.role == "DRIVER") {
    return <DriverHomePage></DriverHomePage>
  }
  if(session.user?.role == "PASSENGER") {
    return <PassengerHomePage></PassengerHomePage>
  }
  else {
    return <AnonHomePage></AnonHomePage>
  }
}