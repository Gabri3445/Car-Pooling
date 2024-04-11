import { Rating } from "@mui/material"
import Image from "next/image"

export interface DriverProfileProps {
    username: string,
    name: string,
    surname: string,
    rating: number,
    pfp: string, //base64
    vehicles: Vehicle[]
}

interface Vehicle {
    licensePlate: string,
    model: string
}

export default function DriverProfile(props: DriverProfileProps) {
    return (
        <div className="rounded-md p-4 bg-secondary shadow-sm shadow-text border flex-col flex items-center text-center w-fit">
            <div className="rounded-full border-4 z-10 w-fit bg-white overflow-hidden bg-text/50">
                <Image width={256} height={256} alt="Profile Picture" src={`data:image/png;base64,${props.pfp}`}></Image>
            </div>
            <span className="text-3xl">{props.name} {props.surname}</span>
            <span className="text-lg text-text/80 mb-2"> {props.username} </span>
            <Rating className="mb-2" readOnly value={props.rating}></Rating>
            {props.rating == -1 ? <span className="text-text/70 text-sm mb-2">This user does not have any ratings</span> : null}
            <div className="text-left w-full">
            {(() => {
                if(props.vehicles.length == 0) {
                    return <span>This user has not added any vehicles</span>
                }
                return (
                    <>
                    <span className="text-lg">Vehicles:</span>
                    {props.vehicles.map((item) => {
                        return <span key={item.licensePlate} className="block font-bold text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">{item.model}</span>
                    })}
                    </>
                )
            })()}
            </div>
        </div>
    )
}