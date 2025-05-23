import React, { useState, useMemo } from "react";
import { Movie } from "@types";
import { formatDuration } from "utils/utils";
import { ChevronDown, ChevronUp, Trash2, Pencil, Search } from 'lucide-react';
import GenreTag from "@components/GenreTag";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

type Props = {
    movies: Array<Movie>;
    onAddMovie: (newMovie: Movie) => Promise<void>;
    onDeleteMovie: (movieId: number) => Promise<void>;
    isAdmin: boolean;
}

const MovieOverviewTable: React.FC<Props> = ({ movies, onDeleteMovie, isAdmin }: Props) => {
    const { t } = useTranslation('common');
    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleDropdownClick = (index: number) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handleEditClick = (movieId: number) => {
        router.push(`/movies/edit/${movieId}`);
    };

    const filteredMovies = useMemo(() => {
        return movies.filter(m => 
            m.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [movies, searchTerm]);

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder={t('searchMovies')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="w-full overflow-x-auto mb-8">
                <div className="w-full min-w-[800px] overflow-hidden rounded-lg shadow-lg">
                    <table className="w-full border-collapse bg-white">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                <th className="w-2/5 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">{t('title')}</th>
                                <th className="w-1/5 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">{t('duration')}</th>
                                <th className="w-1/5 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">{t('more')}</th>
                                {isAdmin && <th className="w-1/4 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">{t('actions')}</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMovies.map((movie, index) => (
                                <React.Fragment key={index}>
                                    <tr className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                                        <td className="w-2/5 px-6 py-4 text-left">{movie.title}</td>
                                        <td className="w-1/5 px-6 py-4 text-center">{formatDuration(movie.duration ?? 0)}</td>
                                        <td className="w-1/5 px-6 py-4 text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out"
                                                onClick={() => handleDropdownClick(index)}
                                            >
                                                {expandedRows[index] ? <ChevronUp className="w-5 h-5 inline" /> : <ChevronDown className="w-5 h-5 inline" />}
                                            </button>
                                        </td>
                                        {isAdmin && (
                                            <td className="w-1/4 px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-4">
                                                    <button
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-150 ease-in-out"
                                                        onClick={() => movie.id !== undefined && onDeleteMovie(movie.id)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 transition-colors duration-150 ease-in-out"
                                                        onClick={() => movie.id !== undefined && handleEditClick(movie.id)}
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                    {expandedRows[index] && (
                                        <tr className="bg-blue-50">
                                            <td colSpan={isAdmin ? 4 : 3} className="px-6 py-4">
                                                <div className="text-sm text-gray-800 max-w-2xl">
                                                    <p className="mb-2"><span className="font-semibold text-blue-800">{t('description')}:</span> {movie.description}</p>
                                                    <div className="mb-2">
                                                        <span className="font-semibold text-blue-800">{t('genres')}: </span>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {movie.genres.map((genre, i) => (
                                                                <GenreTag key={i} genre={genre} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="mb-1"><span className="font-semibold text-blue-800">{t('director')}:</span> {movie.director}</p>
                                                    <p className="mb-1"><span className="font-semibold text-blue-800">{t('released')}:</span> {movie.releaseYear}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MovieOverviewTable;