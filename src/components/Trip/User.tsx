import { validateRequest } from "~/server/auth"
import PastUserRatingWrapper from "../Rating/PastUserRatingWrapper";
import { Rating } from "@mui/material";
import Link from "next/link";

export interface UserProps {
    username: string,
    rating?: number,
    ratingDesc?: string,
    tripId: string,
    userId: string
}

export default async function User(props: UserProps) {
    const { user } = await validateRequest();
    return (
        <div className="flex flex-col bg-secondary shadow-sm shadow-text border rounded-md p-1">
            <div className="flex flex-col">
                <div className="flex items-center mb-2">
                    <Link href={`/user/${props.username}`} className="text-lg ml-1 mr-3">{props.username}</Link>
                    <PastUserRatingWrapper ratingToUsername={props.username} ratingFromId={user!.id} ratingToId={props.userId} ratingToTripId={props.tripId}></PastUserRatingWrapper>
                </div>
                <Rating value={props.rating ?? 0} readOnly></Rating>
            </div>
            <div className="mt-2">
                {props.ratingDesc ?? "No rating given yet"}
            </div>
        </div>
    )
}
/*<Rating value={props.rating ?? 0} readOnly></Rating>*/
/*<button className="bg-accent p-1 rounded-md cursor-pointer">Rate this user</button>*/