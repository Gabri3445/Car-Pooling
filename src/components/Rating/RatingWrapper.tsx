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
    const [value, setValue] = useState<number | null>(null);
    const ratingModalProps: RatingModalProps = {
        ratingFromId: props.ratingFromId,
        ratingToId: props.ratingToId,
        ratingToTripId: props.ratingToTripId,
        ratingToUsername: props.ratingToUsername
    }
    return (
        <>
            <Rating value={value}
                onChange={(event, newValue) => {
                    handleOpen();
                }}></Rating>
            <Modal open={open} onClose={handleClose}>
                <RatingModal {...ratingModalProps}></RatingModal>
            </Modal>
        </>
    )
}