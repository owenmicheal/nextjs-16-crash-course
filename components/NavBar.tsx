'use client';

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

const Navbar = () => {
    const handleNavClick = (linkName: string) => {
        posthog.capture('nav_link_clicked', {
            link_name: linkName,
            link_location: 'navbar',
        });
    };

    return (
        <header>
            <nav>
                <Link href='/' className="logo" onClick={() => handleNavClick('logo')}>
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                    <p>NuruEvents</p>
                </Link>

                <ul>
                    <Link href="/" onClick={() => handleNavClick('home')}>Home</Link>
                    <Link href="/" onClick={() => handleNavClick('events')}>Events</Link>
                    <Link href="/" onClick={() => handleNavClick('create_event')}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar