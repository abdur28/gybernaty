'use client'

import {classNames} from "@/shared/lib/classNames/classNames";
import cls from "./Header.module.scss";
import React from "react";
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import {Logo} from "@/shared/ui/Logo/Logo";
import {NavbarTablet} from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";
import { useAppKit, useWalletInfo } from "@reown/appkit/react";


interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}

export const Header = ({className = ""}: HeaderProps) => {
    const w3mButton = useAppKit()
    const { walletInfo } = useWalletInfo()
    return (
        <div className={classNames(cls.Header, {}, [className])}>
            <Link href={'/'}>
                <Logo>Gyber</Logo>
            </Link>

            <div className={cls.btnGroup}>
                <Documents />

                {/* This is a tes, edit this later. */}
                <a style={{
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                }} href={"http://13.60.232.198:50/"}>
                    Docs
                </a>


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
