'use client'
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Search, X } from "react-bootstrap-icons";

//TODO refactor this

const SearchBar = () => {
    const fromSearchBar: React.RefObject<HTMLInputElement> = useRef(null)
    const toSearchBar: React.RefObject<HTMLInputElement> = useRef(null)


    const router = useRouter();

    const [icon, setIcon] = useState(<Search className="cursor-pointer" onClick={() => fromSearchBar?.current?.focus()}></Search>)
    return (
        <>
            <div className="md:w-96 w-40 bg-secondary h-8 rounded-md flex items-stretch">
                <div className="pl-3 flex items-center">
                    {icon}
                </div>
                <form className="flex w-full items-center"  onSubmit={(e) => {
                    e.preventDefault()
                    router.push(`/search?${new URLSearchParams({from: fromSearchBar.current!.value, to: toSearchBar.current!.value}).toString()}`)
                }}>
                    <label htmlFor="from">From:</label>
                    <input ref={fromSearchBar} name="from" id="from" required className="pl-3 w-full rounded-md bg-secondary mr-1 placeholder-text" onFocus={() => { setIcon(<X className="cursor-pointer" size={20}></X>) }} onBlur={() => setIcon(<Search onClick={() => fromSearchBar?.current?.focus()} className="cursor-pointer"></Search>)} placeholder="From..." type="search"></input>
                    <label htmlFor="to">To:</label>
                    <input ref={toSearchBar} name="to" id="to" required className="pl-3 w-full rounded-md bg-secondary mr-1 placeholder-text" onFocus={() => { setIcon(<X className="cursor-pointer" size={20}></X>) }} onBlur={() => setIcon(<Search onClick={() => toSearchBar?.current?.focus()} className="cursor-pointer"></Search>)} placeholder="To..." type="search"></input>
                    <input className="hidden" type="submit" value={"Search"}/>
                </form>
            </div>
        </>
    )
}

export default SearchBar;