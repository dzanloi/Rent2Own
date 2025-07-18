import { connectDB } from "@/lib/connection";
import User from "@/models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "Name", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                await connectDB();

                const user = await User.findOne({ name: credentials?.name });

                if (!user) {
                    return null;
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                };
            },
        })
    ],

    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === "google") {
                    await connectDB();

                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        await User.create({
                            name: user.name,
                            password: "", // No password for Google users
                        });
                    }
                }
                return true;
            } catch (error) {
                console.error("SIGNIN ERROR:", error);
                return false;
            }
        },

        async session({ session }) {
            await connectDB();
            const dbUser = await User.findOne({ email: session.user?.email });

            if(dbUser) {
                session.user.id = dbUser._id.toString();
                session.user._id = dbUser._id.toString(); // ✅ ADDED: Make _id available in session
                session.user.role = dbUser.role;  // Store role in session
            }
            console.log("Session User: ", session.user);

            return session;
        },
        // async redirect({ url, baseUrl, session }) {
        //     // Redirect after login
        //     if (session?.user?.role === "admin") {
        //         return '/admin';
        //     }
        //     return '/rent-page';
        // },
    },

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
