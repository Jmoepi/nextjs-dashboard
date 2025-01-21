import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
//signIn: '/login'
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        }, //authorized function will check if the user is authorized to access the dashboard
    }, //callbacks object will contain the authorized function for the application
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig; //the purpose of this file is to configure the authentication settings for the application