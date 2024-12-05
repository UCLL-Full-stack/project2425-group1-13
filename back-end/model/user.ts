import { Role } from './role';
import { Watchlist } from './watchlist';
import { User as UserPrisma, Watchlist as WatchlistPrisma, Media as MediaPrisma } from '@prisma/client';

export class User {
    private id?: number;
    private name: string;
    private password: string;
    private email: string;
    private creationDate: Date;
    private watchlists: Watchlist[];
    private role: Role;

    constructor(user: { 
        id?: number;
        name: string, 
        password: string, 
        email: string 
    }) {
        this.validate(user);

        this.id = user.id;
        this.name = user.name;
        this.password = user.password;
        this.email = user.email;
        this.creationDate = new Date();
        this.watchlists = [];
        this.role = Role.USER;
    }

    // Getters
    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getCreationDate(): Date {
        return this.creationDate;
    }

    public getPassword(): string {
        return this.password;
    }

    public getWatchlists(): Watchlist[] {
        return this.watchlists;
    }

    public getRole(): Role {
        return this.role;
    }

    // Setters
    public setName(name: string): void {
        this.name = name;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setRole(role: Role): void {
        this.role = role;
    }

    // Methods to manage watchlists
    public addWatchlistToUser(watchlist: Watchlist): void {
        this.watchlists.push(watchlist);
    }

    addWatchlists(watchlists: Watchlist[]): void {
        this.watchlists.push(...watchlists);
    }

    public deleteWatchlistFromUser(watchlist: Watchlist): void {
        const index = this.watchlists.indexOf(watchlist);
        this.watchlists.splice(index, 1);  
    }

    private validate(user: {
        name: string;
        password: string;
        email: string;
    }) {
        if (!user.name?.trim()) {
            throw new Error('Username is required');
        }
        if (user.name.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (user.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            throw new Error('Email is not valid');
        }
    }

    
    static from({
        id,
        name,
        password,
        email,
        role,
    }: UserPrisma): User { 
        const user = new User({
            id,
            name,
            password,
            email,
        });
        user.setRole(role as Role);
        return user;
    }
}


