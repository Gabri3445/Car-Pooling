"use client"

import { Modal } from "@mui/material"
import { useState } from "react"
import RatingModal, { RatingModalProps } from "./RatingModal"

interface PastUserRatingWrapperProps {
    value?: number
    readOnly?: boolean
    ratingFromId: string,
    ratingToId: string,
    ratingToPfp?: string,
    ratingToTripId: string,
    ratingToUsername: string
}

export default function PastUserRatingWrapper(props: PastUserRatingWrapperProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const ratingModalProps: RatingModalProps = {
        ratingFromId: props.ratingFromId,
        ratingToId: props.ratingToId,
        ratingToPfp: props.ratingToPfp,
        ratingToTripId: props.ratingToTripId,
        ratingToUsername: props.ratingToUsername
    }
    return (
        <>
            <button onClick={handleOpen} className="bg-accent p-1 rounded-md cursor-pointer">Rate this user</button>
            <Modal open={open} onClose={handleClose}>
                <RatingModal {...ratingModalProps}></RatingModal>
            </Modal>
        </>
    )
}