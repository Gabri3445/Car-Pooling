export default function Error(props: {message: string}) {
    return (
        <div className="w-full mb-6 bg-red/50 p-2 rounded border-text border-2">
            {props.message}
        </div>
    )
}