import crypto from "crypto";
import { v4 as uuid4 } from "uuid";
import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100000, 1000000).toString();
    // Expire in 5 mins
    // Better to be a configuration
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });
    return twoFactorToken;
}


export const generatePasswordResetToken = async (email: string) => {
    const token = uuid4();
    // Expire in 1 hour
    // Better to be a configuration
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        } 
    });
    return passwordResetToken;
}
export const generateVerificationToken = async (email: string) => {
    const token = uuid4();
    // Expire in 1 hour
    // Better to be a configuration
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        const verificationToken = await db.verificationToken.update({
            where: {
                id: existingToken.id
            },
            data: {
                token,
                expires
            }
        });
        return verificationToken;
    } else {
        const verificationToken = await db.verificationToken.create({
            data: {
                email,
                token,
                expires
            }
        });
        return verificationToken;
    }
}