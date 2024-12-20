import { Genre } from "../genre/genre";
import { Media } from "./media";
import { Media as MediaPrisma } from '@prisma/client';

export class Movie extends Media {
    private duration: number;
    private director: string;

    constructor(movie: {
        id?: number;
        title: string;
        description: string;
        releaseYear: number;
        genres: Genre[];
        duration: number;
        director: string;
    }) {
        super({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            releaseYear: movie.releaseYear,
            genres: movie.genres,
            type: "MOVIE",
        });
        this.validate_movie(movie);

        this.duration = movie.duration;
        this.director = movie.director;
    }

    public getDuration(): number {
        return this.duration;
    }

    public getDirector(): string {
        return this.director;
    }

    public setDuration(duration: number): void {
        this.duration = duration;
    }

    public setDirector(director: string): void {
        this.director = director;
    }

    private validate_movie(movie: {
        duration: number;
        director: string;
    }): void {
        if (!movie.duration || movie.duration < 0) {
            throw new Error("Movie duration is required and must be greater than 0");
        }
        if (!movie.director) {
            throw new Error("Movie director is required");
        }
    }

    static from(mediaPrisma: MediaPrisma): Movie {
        return new Movie({
            id: mediaPrisma.id,
            title: mediaPrisma.title,
            description: mediaPrisma.description,
            releaseYear: mediaPrisma.releaseYear,
            genres: mediaPrisma.genres.map((genre: string) => Genre[genre as keyof typeof Genre]),
            duration: mediaPrisma.duration!,
            director: mediaPrisma.director!,
        });
    }
}
