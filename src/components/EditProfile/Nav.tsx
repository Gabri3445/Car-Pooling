import Link from "next/link"

interface NavProps {
    title: string
    id: string
    sections: Section[]
}

export interface Section {
    id: string,
    title: string
}

export default function Nav(props: NavProps) {
    return (
        <nav className="flex-2">
            <Link className="text-4xl underline" href={props.id}>{props.title}</Link>
            <div className="ml-4">
                <ul className="mt-2">
                    {props.sections.map(item => {
                        return (
                            <li key={item.id}>
                                <Link className="text-2xl underline" href={item.id}>- {item.title}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
}
