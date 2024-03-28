export default async function PassengerHomePage() {
    return (
        <main className="flex items-center m-5 justify-between">
          <div className="flex items-center flex-col">
            <h1 className="text-center mb-5 leading-normal text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Passenger Profile</h1>
           
          </div>
          <div className="grow m-6">
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Users To Accept</h1>
            <h1 className="text-center mb-5 mt-5 text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Trips</h1>
            <div className="flex flex-col items-center">
            </div>
            <h1 className="mb-5 mt-5 text-center text-6xl font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Your Past Trips</h1>
            <div className="flex flex-col items-center">
            </div>
          </div>
        </main>
    )
}