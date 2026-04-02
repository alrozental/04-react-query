import './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Pagination from '../Pagination/Pagination';

import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';

import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['movies', search, currentPage],
    queryFn: () => fetchMovies(search, currentPage),
    enabled: search.trim() !== '',
    retry: 2,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast.error('No movies found for your request.');
      return;
    }
  }, [data, isSuccess]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages > 500 ? 500 : totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

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
