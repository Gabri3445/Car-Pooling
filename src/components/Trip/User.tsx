import { Rating } from "@mui/material"

export interface UserProps {
    username: string,
    rating?: number,
    ratingDesc?: string
}

export default async function User(props: UserProps) {
    return (
        <div className="flex flex-col border rounded-md p-1">
            <div className="flex flex-col">
                <div className="flex items-center mb-2">
                    <span className="text-lg ml-1 mr-3">{props.username}</span>
                    <button className="bg-accent p-1 rounded-md cursor-pointer">Rate this user</button>
                </div>
                <Rating value={props.rating ?? 0} readOnly></Rating>
            </div>
            <div className="mt-2">
                {props.rating ?? "No rating given yet"}
            </div>
        </div>
    )
}