"use client"

import { Modal } from "@mui/material"
import Rating from "@mui/material/Rating/Rating"
import { useState } from "react"
import RatingModal, { RatingModalProps } from "./RatingModal"

interface RatingWrapperProps {
    value?: number
    readOnly?: boolean
    ratingFromId: string,
    ratingToId: string,
    ratingToPfp?: string,
    ratingToTripId: string,
    ratingToUsername: string
}

export default function RatingWrapper(props: RatingWrapperProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const ratingModalProps: RatingModalProps = {
        ratingFromId: props.ratingFromId,
        ratingToId: props.ratingToId,
        ratingToTripId: props.ratingToTripId,
        ratingToUsername: props.ratingToUsername
    }
    return (
        <>
            <Rating value={props.value ?? 0} readOnly={props.readOnly ?? true}></Rating>
            <Modal open={open} onClose={handleClose}>
                <RatingModal {...ratingModalProps}></RatingModal>
            </Modal>
        </>
    )
}