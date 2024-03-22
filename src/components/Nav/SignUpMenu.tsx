"use client"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const SignUpMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const pathname = usePathname();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSignUp = async () => {
        router.push(`/signup?callback=${encodeURIComponent(pathname)}`)
    };
    const handleLogIn = async () => {
        router.push(`/signin?callback=${encodeURIComponent(pathname)}`);
    }
    const handleDriverSignUp = async () => {
        router.push(`/signup/driver?callback=${encodeURIComponent(pathname)}`);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            <button onClick={handleClick}>Sign up </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleSignUp}>Passenger Sign Up</MenuItem>
                <MenuItem onClick={handleDriverSignUp} >Driver Sign Up</MenuItem>
                <MenuItem onClick={handleLogIn}>Log in</MenuItem>
            </Menu>
        </div>
    )
}

export default SignUpMenu;