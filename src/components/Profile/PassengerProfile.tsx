import { Rating } from "@mui/material"

export interface PassengerProfileProps {
    username: string,
    name: string,
    surname: string,
    rating: number,
}

export default function PassengerProfile(props: PassengerProfileProps) {
    return (
        <div className="rounded-md p-4 border flex-col flex items-center text-center w-fit">
            <span className="text-3xl">{props.name} {props.surname}</span>
            <span className="text-lg text-text/80 mb-2"> {props.username} </span>
            <Rating className="mb-2" readOnly value={props.rating}></Rating>
            {props.rating == -1 ? <span className="text-text/70 text-sm mb-2">This user does not have any ratings</span> : null}
        </div>
    )
}