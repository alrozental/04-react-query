import './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';

import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data: movies = [],
    isSuccess,
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ['movies', search],
    queryFn: () => fetchMovies(search),
    enabled: search.trim().length > 0,
    retry: 2,
  });

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast.error('No movies found for your request.');
      return;
    }
  }, [movies, isSuccess]);

  return (
    <>
      <SearchBar onSubmit={setSearch} />
      <Toaster position="top-right" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          onClose={() => setSelectedMovie(null)}
          movie={selectedMovie}
        />
      )}
    </>
  );
}
