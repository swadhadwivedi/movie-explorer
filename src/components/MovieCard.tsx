import { Movie } from '../types/movie';

interface Props {
  movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
  return (
    <div className="movie-card">
      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
      <h3>{movie.title}</h3>
    </div>
  );
};

export default MovieCard;
