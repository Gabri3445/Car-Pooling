"use client"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Role } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '~/api/signout';



const ProfileMenu = (props : {username: string, role: Role}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const pathname = usePathname();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const router = useRouter()
    const handleProfile = () => {
        router.push(`/user/${props.username}`)
    };
    const handleEditProfile = () => {
        router.push(`/profile/${props.role === 'DRIVER' ? 'driver' : 'passenger'}`)
    }
    /**
     * @deprecated Use the server action
     */
    const handleLogOut = async () => {
        router.push(`/signout?callback=${encodeURIComponent(pathname)}`)
    }
    const handleClose = () => {
        setAnchorEl(null);
    }


    return (
        <div>
            <button onClick={handleClick}>{props.username}</button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={async () => await signOut()}>Log out</MenuItem>
            </Menu>
        </div>
    )
}

export default ProfileMenu;