import React from "react";
import { MOVIE_ITEM } from "../MovieItem/MovieItem";
import Button from "../Button/Button";
import "./MovieDetail.scss";

type MOVIE_DETAIL = {
  onRendered?: () => void;
  isShow?: boolean;
  overview?: string;
} & MOVIE_ITEM;

const MovieDetail: React.FC<MOVIE_DETAIL> = (props) => {
  const {
    title,
    posterUrl,
    overview,
    genres,
    releaseDate,
    isShow = false,
  } = props;

  const handleDetailClick: React.MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();

  if (!isShow) {
    return (
      <div
        className="movie-detail"
        id="movie-detail"
        onClick={handleDetailClick}
      />
    );
  }

  return (
    <div className="movie-detail" id="movie-detail" onClick={handleDetailClick}>
      <div className="movie-detail--thumnail">
        <img src={posterUrl} alt={title} />
      </div>

      <div className="movie-detail--content">
        <h2>{title}</h2>

        <p className="overview">{overview}</p>

        <p className="release-date">
          <strong>Released date:</strong> {releaseDate}
        </p>

        <div className="genres">
          <div>
            <strong>Genres:</strong>
          </div>
          <div className="genres--list">
            {genres?.map((g: string) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="action">
        <Button>Watch now</Button>
      </div>
    </div>
  );
};

export default MovieDetail;
