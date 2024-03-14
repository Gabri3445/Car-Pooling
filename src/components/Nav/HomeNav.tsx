import Link from "next/link";
import SearchBar from "./SearchBar";
import SignUpMenu from "./SignUpMenu";
import ProfileMenu from "./ProfileMenu";
import { validateRequest } from "~/server/auth";

const HomeNav = async () => {

    const session = await validateRequest(); 

    return (
        <div className="flex h-12 items-center justify-between bg-primary relative font-bold">
            <Link href="/" className="leading-[3rem] ml-7 text-lg">Car Pooling</Link>
            <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                <SearchBar></SearchBar>
            </div>
            <div className="mr-7 flex items-center justify-center">
                {session.user ? <ProfileMenu username={session.user.username}></ProfileMenu> : <SignUpMenu></SignUpMenu> }
            </div>
        </div>
    )
}

/*
<Link href="">{props.username}</Link>
*/

export default HomeNav;