import React from "react";
import MovieItemSkeleton from "./MovieItemSkeleton";
import "./MovieItem.scss";

export type MOVIE_ITEM = {
  id: number;
  posterUrl: string;
  title: string;
  point?: number;
  releaseDate?: string;
  genres?: string[];
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  loading?: boolean;
};

const MovieItem: React.FC<MOVIE_ITEM> = (props: MOVIE_ITEM) => {
  const {
    id,
    posterUrl,
    title,
    releaseDate,
    genres,
    onClick = () => {},
    loading = false,
  } = props;

  if (loading) return <MovieItemSkeleton />;

  return (
    <div className="movie" id={`movie-${id}`} onClick={onClick}>
      <div className="thumbnail">
        <img src={posterUrl} alt={title} loading="lazy" />
      </div>
      <div className="detail">
        <p>
          <strong>{title}</strong>
        </p>

        <p>Release date: {releaseDate}</p>
      </div>
    </div>
  );
};

export default MovieItem;
