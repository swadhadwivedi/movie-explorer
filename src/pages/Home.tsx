import { useState, useEffect } from 'react';
import { fetchMovies } from '../api/tmdb';
import { getMovieRecommendations } from '../api/genai';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import { Movie } from '../types/movie';

interface MovieWithDescription extends Movie {
  description?: string;
}

const Home = () => {
  const [query, setQuery] = useState('avengers');
  const [results, setResults] = useState<MovieWithDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleSearch = () => setSearchTrigger((prev) => prev + 1);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) return;

      setLoading(true);
      setResults([]);

      const isMoodQuery = /feel|mood|set in|vibe|recommend|something.*like/i.test(query);

      try {
        if (isMoodQuery) {
          const response = await getMovieRecommendations(query);
          const lines = response.split('\n').filter(line => line.trim());
          const parsed = lines.map(line => {
            const parts = line.replace(/^\d+\.|[-•]/, '').split(/ - |: /);
            return {
              title: parts[0]?.trim(),
              description: parts[1]?.trim() || ''
            };
          }).filter(item => item.title);

          const movieFetches = await Promise.all(
            parsed.map(async ({ title, description }) => {
              const res = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=1ecdbef3eb9b801bc5274aa09c1b5950&query=${encodeURIComponent(title)}`
              );
              const data = await res.json();
              const movie = data.results?.find((m: { poster_path: any }) => m.poster_path);
              return movie ? { ...movie, description } : null;
            })
          );

          setResults(movieFetches.filter(Boolean) as MovieWithDescription[]);
        } else {
          const data = await fetchMovies(query);
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [searchTrigger]);

  const isMoodCard = (movie: MovieWithDescription) => !!movie.description;

  return (
    <div>
      <h1>🎬 Movie Explorer</h1>
      <p>
        You can search movies, according to your mood or your vibe. Try looking for <strong>"Movies set in N Y C"</strong>.
      </p>

      <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
      {loading ? (
        <Loader />
      ) : (
        <div className="movie-grid">
          {results.map((movie) =>
            isMoodCard(movie) ? (
              <div
                key={movie.id}
                style={{
                  display: 'flex',
                  backgroundColor: '#222',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  alignItems: 'flex-start',
                  gap: '16px',
                  maxWidth: '600px',
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{ borderRadius: '8px' }}
                />
                <div>
                  <h3 style={{ color: '#d4af37', marginBottom: '8px' }}>{movie.title}</h3>
                  <p style={{ color: '#fff' }}>{movie.description}</p>
                </div>
              </div>
            ) : (
              <div key={movie.id} className="movie-card" style={{ textAlign: 'center' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{ borderRadius: '8px' }}
                />
                <h3>{movie.title}</h3>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
