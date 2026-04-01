import axios from 'axios';
import type { Movie } from '../types/movie.ts';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
});

export interface MoviesResponse {
  results: Movie[];
}

export default async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await api.get<MoviesResponse>('/search/movie', {
    params: {
      query: query,
    },
  });
  return response.data.results;
}
