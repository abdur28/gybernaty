'use client'

import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Header.module.scss";
import React from "react";
import { Button, ThemeButton } from "@/shared/ui/Button/Button";
import { Logo } from "@/shared/ui/Logo/Logo";
import { NavbarTablet } from "../Navbar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}


export const Header = ({className = ""}: HeaderProps) => {
    const { 
        w3mButton, 
        walletInfo, 
        isConnected, 
        checkUserAccess, 
        handleWikiRedirect,
        isCheckingAccess,
        isWikiLoading,
        address
    } = useAuth();

    const handleDocsClick = async () => {
        if (!isConnected) {
            w3mButton.open();
            return;
        }
    
        try {
            const { exists, balance } = await checkUserAccess();
            
            if (!exists) {
                window.location.href = '/register';
                return;
            }

            if (balance !== null) {
                await handleWikiRedirect(address!, balance);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={classNames(cls.Header, {}, [className])}>
            <Link href={'/'}>
                <Logo>Gyber</Logo>
            </Link>

            <div className={cls.btnGroup}>
                <Button 
                    onClick={handleDocsClick} 
                    theme={ThemeButton.ORANGE}
                    disabled={isCheckingAccess || isWikiLoading}
                >
                    {isCheckingAccess ? 'Checking Access...' : 
                     isWikiLoading ? 'Loading Wiki...' : 'Docs'}
                </Button>

                {walletInfo === undefined ? (
                    <Button onClick={() => w3mButton.open()} theme={ThemeButton.ORANGE}>
                        Dapp
                    </Button>
                ) : (
                    <w3m-account-button />
                )}

                <NavbarTablet/>
            </div>
        </div>
    );
};