import { User } from '../model/user';
import prisma from './database';

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where: { email }
        });
        if (!userPrisma) {
            return null;
        }
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See console for details.');
    }
};

const getUserByName = async (name: string): Promise<User> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where: { name }
        });
        if (!userPrisma) {
            throw new Error(`User with name ${name} not found.`);
        }
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See console for details.');
    }
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await prisma.user.findMany({
            include: {watchlists: {include: {mediaItems: true}
        },
        },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See console for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await prisma.user.create({
            data: {
                name: user.getName(),
                password: user.getPassword(),
                email: user.getEmail(),
                role: user.getRole(),
            }
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See console for details.');
    }
}

export default {
    getUserByEmail,
    getUserByName,
    getAllUsers,
    createUser,
};