'use client'

import {classNames} from "@/shared/lib/classNames/classNames";
import cls from "./Header.module.scss";
import React, { useEffect } from "react";
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import {Logo} from "@/shared/ui/Logo/Logo";
import {NavbarTablet} from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";
import { useAppKit, useAppKitAccount, useWalletInfo } from "@reown/appkit/react";


interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}

export const Header = ({className = ""}: HeaderProps) => {
    const w3mButton = useAppKit()
    const { walletInfo } = useWalletInfo()
    const { address, isConnected, caipAddress, status } = useAppKitAccount()

    // console.log(address, isConnected, caipAddress, status)

    const redirect = () => {
        fetch('/api/auth/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({address})
        })
            // .then(response => response.json())
            // .then(data => console.log(data))
    }

    useEffect(() => {
        if (status === 'connected') {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({address})
            })
                .then(response => response.json())
                .then(data => console.log(data))
        }
    }, [status])
    return (
        <div className={classNames(cls.Header, {}, [className])}>
            <Link href={'/'}>
                <Logo>Gyber</Logo>
            </Link>

            <div className={cls.btnGroup}>
                <Documents />

                {/* This is a tes, edit this later. */}
                {/* <a style={{
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                }} href={"http://13.60.232.198:50/"}>
                    Docs
                </a> */}

                <button onClick={() => redirect()}>
                    Docs
                </button>


                {walletInfo === undefined ? <Button onClick={() => w3mButton.open()} theme={ThemeButton.ORANGE} >
                    Dapp
                </Button> : <w3m-account-button />}

                {/* Appkit Custom Button */}
                {/* <w3m-button /> */} 

                <NavbarTablet/>
            </div>
        </div>
    );
};

