"use server"

import { db } from "~/server/db"

export interface ReviewData {
    ratingFromId: string,
    ratingToId: string,
    ratingToTripId: string,
}

export async function review(data: ReviewData, formData: FormData) {
    const rating = {
        rating: Number(formData.get("rating")),
        desc: formData.get("desc") as string
    }
    try {
        const ratingExists = await db.rating.findFirstOrThrow({
            where: {
                FromUserId: data.ratingFromId,
                tripId: data.ratingToTripId,
                ToUserId: data.ratingToId
            },
            select: {
                id: true
            }
        }) // this executes if there is a review
        await db.rating.update({
            where: {
                id: ratingExists.id
            },
            data: {
                star: rating.rating,
                desc: rating.desc
            }
        })
    } catch (_) { // this executes if there is no review
        await db.rating.create({
            data: {
                desc: rating.desc,
                star: rating.rating,
                FromUserId: data.ratingFromId,
                ToUserId: data.ratingToId,
                tripId: data.ratingToTripId
            }
        })
    }
}