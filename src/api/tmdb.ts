import { MovieResponse } from '../types/movie';

const API_KEY = '1ecdbef3eb9b801bc5274aa09c1b5950';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (query: string): Promise<MovieResponse> => {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
};
