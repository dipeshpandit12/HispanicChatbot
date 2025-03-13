import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import { connectToDB } from "@/utils/database";
import User from '@/models/user';

const handler = NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'email,pages_show_list,instagram_basic,instagram_manage_insights'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectToDB();
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            hasBusinessData: false,
            socialAuth: {
              facebook: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined
              }
            }
          });
        } else {
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                'socialAuth.facebook': {
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined
                }
              }
            }
          );
        }

        return true;
      } catch (error) {
        console.error('Facebook SignIn Error:', error);
        return false;
      }
    },
    async session({ session }) {
      if (session.user) {
        const user = await User.findOne({ email: session.user.email });
        session.user.id = user._id.toString();
        session.user.hasBusinessData = user.hasBusinessData;
        session.accessToken = user.socialAuth?.facebook?.accessToken;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
});

export { handler as GET, handler as POST };