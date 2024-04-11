import Link from "next/link";
import SearchBar from "./SearchBar";
import SignUpMenu from "./SignUpMenu";
import ProfileMenu from "./ProfileMenu";
import { validateRequest } from "~/server/auth";
import { Role } from "@prisma/client";
import { CaretDown } from "react-bootstrap-icons";

const HomeNav = async () => {

    const session = await validateRequest();

    return (
        <div className="flex h-14 items-center bg-background justify-between border-b-[1px] relative font-bold">
            <Link href="/" className="h-full ml-4 text-5xl text-text/0 text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Car Pooling</Link>
            <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                <SearchBar></SearchBar>
            </div>
            <div className="mr-7 flex items-center justify-center">
                {session.user?.role == "DRIVER" ? <Link href="/create" className="pr-5">+ Create a trip</Link> : null}
                {session.user ? <ProfileMenu role={session.user.role as Role} username={session.user.username}></ProfileMenu> : <SignUpMenu></SignUpMenu>} <CaretDown></CaretDown>
            </div>
        </div>
    )
}

export default HomeNav;