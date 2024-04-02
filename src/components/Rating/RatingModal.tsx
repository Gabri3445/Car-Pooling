import { Rating } from "@mui/material"
import { useState } from "react";
import { ReviewData, review } from "~/api/review";

export interface RatingModalProps {
    ratingFromId: string,
    ratingToId: string,
    ratingToUsername: string
    ratingToTripId: string,
}

export default function RatingModal(props: RatingModalProps) {
    const [value, setValue] = useState<number | null>(null);
    const data: ReviewData = {
        ratingFromId: props.ratingFromId,
        ratingToId: props.ratingToId,
        ratingToTripId: props.ratingToTripId,
    }
    return (
        <div className="flex flex-row justify-center relative top-1/2 -translate-y-1/2">
            <form action={review.bind(null, data)} className="flex flex-col w-1/2 bg-background border rounded-lg">
                <div className="m-5">
                    <div className="flex">
                        <div className="flex flex-col">
                            <span className="text-lg ml-1 mr-3">{props.ratingToUsername}</span>
                            <Rating value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}></Rating>
                            <input type="number" name="rating" required value={value ?? undefined} id="rating" className="hidden" />
                        </div>
                    </div>
                    <div className="flex flex-col mt-5">
                        <label className="mb-1 ml-1" htmlFor="note">Review:</label>
                        <textarea required className="ml-1 bg-secondary rounded-md max-h-96 min-h-64" name="desc" id="desc"></textarea>
                        <div className="mt-5 flex flex-row-reverse w-full">
                            <input className="bg-accent p-3 rounded-md cursor-pointer" type="submit" value="Submit review" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}