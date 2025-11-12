/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getListMovie, getListGenres } from "../../constants/apis";
import { useHttpService, METHODS } from "../../hooks/useHttpService";
import MovieItem from "../../components/MovieItem/MovieItem";
import MovieItemSkeleton from "../../components/MovieItem/MovieItemSkeleton";
import MovieDetail from "../../components/MovieDetail/MovieDetail";
import Button from "../../components/Button/Button";
import Filter from "../../components/Filter/Filter";
import {
  GENRE,
  MAPPING_GENRE,
  Metadata,
  OPTION,
  FilterData,
} from "../../utils/types";

import "./home.scss";

const IMAGE_HOST: string = "https://image.tmdb.org/t/p"; //w200/jJ8AiqKKiZWZaiYMyhlF0FNH4xJ.jpg

type mappingGenresByIdType = (genres: GENRE[]) => MAPPING_GENRE;

const mappingGenresById: mappingGenresByIdType = (genres) => {
  const init: MAPPING_GENRE = {};
  return genres.reduce(
    (res: MAPPING_GENRE, g: GENRE) => ({ ...res, [g.id]: g.name }),
    init
  );
};

export const delay: (time: number) => Promise<null> = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(null), time));

const Home: React.FC = () => {
  const httpService = useHttpService();
  const isInit = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<{
    event: any;
    data: any;
  } | null>(null);
  const [genres, setGenres] = useState<MAPPING_GENRE>({});
  const [genresOptions, setGenresOptions] = useState<OPTION[]>([]);
  const [movies, setMovies] = useState<Record<string, any>[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({
    page: 1,
    totalPage: 1,
    totalResult: 0,
  });
  const [filter, setFilter] = useState<FilterData & { page: number }>({
    text: "",
    genres: [],
    page: 1,
  });

  const updateDetailStyle = useCallback(
    (isShow: boolean, posX: number = 0, posY: number = 0) => {
      const detailEle: HTMLElement | null =
        document.getElementById("movie-detail");

      if (detailEle) {
        if (isShow) {
          const { innerWidth, innerHeight } = window;
          const { offsetWidth, offsetHeight } = detailEle;

          /**
           * if posY < innerHeight =>> not scroll down yet
           * and posY + offsetHeight >= innerHeight
           * =>> show detail content above pointer
           */
          let newTop = posY;
          let newLeft = posX;
          if (posY < innerHeight) {
            if (posY + offsetHeight >= innerHeight) {
              newTop = posY - offsetHeight;
            }
          } else {
            // User already scroll down
            newTop = posY - offsetHeight;
          }

          /**
           * posX + offsetWidth >= innerWidth
           * =>> show detail content at left of the ponter
           */
          if (posX + offsetWidth >= innerWidth) {
            newLeft = posX - offsetWidth;
          }

          detailEle.style.position = "absolute";
          detailEle.style.top = `${newTop}px`;
          detailEle.style.left = `${newLeft}px`;
          detailEle.style.zIndex = "11";

          return;
        }
        detailEle.removeAttribute("style");
      }
    },
    []
  );

  const updateBodyStyle = useCallback((isShow: boolean) => {
    const collections: HTMLCollectionOf<HTMLBodyElement> =
      document.getElementsByTagName("body");
    const bodyEle: HTMLBodyElement | null = collections.item(0);

    if (bodyEle) {
      if (isShow) {
        bodyEle.style.overflow = "hidden";
        return;
      }

      bodyEle.removeAttribute("style");
    }
  }, []);

  const handleShowDetail = useCallback(async () => {
    if (!selected) return;

    const { event, data } = selected;
    const { pageX, pageY } = event;

    const backdropEle: HTMLElement | null = document.getElementById("backdrop");
    const movieEle: HTMLElement | null = document.getElementById(
      `movie-${data.id}`
    );

    updateDetailStyle(true, pageX, pageY);
    updateBodyStyle(true);

    if (backdropEle) {
      backdropEle.classList.add("show");
    }

    if (movieEle) {
      movieEle.classList.add("selected");
    }
  }, [selected]);

  const handleClick = useCallback((e: any, item: any) => {
    setSelected({
      event: e,
      data: item,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderListMovies = useCallback(
    () =>
      movies.map((m) => (
        <MovieItem
          key={m.id}
          id={m.id}
          posterUrl={`${IMAGE_HOST}/w200${m.poster_path}`}
          title={m.original_title}
          releaseDate={m.release_date}
          genres={m.genre_ids.map((id: number) => genres[id])}
          onClick={(e: any) => handleClick(e, m)}
          loading={loading}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [movies, genres, loading]
  );

  const handleBackdropClick = useCallback(() => {
    const backdropEle: HTMLElement | null = document.getElementById("backdrop");
    const selectedEle: HTMLElement | null = document.getElementById(
      `movie-${selected?.data.id}`
    );

    updateDetailStyle(false);
    updateBodyStyle(false);

    if (backdropEle) {
      backdropEle.classList.remove("show");
    }

    if (selectedEle) {
      selectedEle.classList.remove("selected");
    }

    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const fetchMovieData = useCallback(
    async (data: FilterData & { page: number }) => {
      const searchParams = new URLSearchParams({
        with_keywords: data.text,
        with_genres: data.genres.map((d: OPTION) => d.value).join(","),
        page: `${data.page}`,
      });

      setLoading(true);

      const moviesRes: any = await httpService(
        `${getListMovie}?${searchParams.toString()}`,
        METHODS.get
      );

      setMovies(moviesRes?.results);
      setMetadata({
        page: moviesRes.page,
        totalPage: moviesRes.total_pages,
        totalResult: moviesRes.total_results,
      });
      setLoading(false);
    },
    [filter]
  );

  const handleNext = useCallback(() => {
    setFilter({
      ...filter,
      page: filter.page + 1,
    });
    fetchMovieData({
      ...filter,
      page: filter.page + 1,
    });
  }, [filter]);

  const handlePrev = useCallback(() => {
    setFilter({
      ...filter,
      page: filter.page - 1,
    });
    fetchMovieData({
      ...filter,
      page: filter.page - 1,
    });
  }, [filter]);

  const handleFilter = useCallback(async (data: FilterData) => {
    setFilter({ ...filter, ...data });
    fetchMovieData({ ...filter, ...data });
  }, []);

  const renderPreloadState = useCallback(() => {
    const { innerHeight, innerWidth } = window;
    const baseItemSize: { width: number; height: number } = {
      width: 234,
      height: 378,
    };

    const maxCol = Math.ceil(innerWidth / baseItemSize.width) - 1;
    const maxRow = Math.ceil(innerHeight / baseItemSize.height) - 1;
    const maxItem = maxCol * maxRow;
    const items: number[] = [];
    items.length = maxItem;
    items.fill(1);

    return items.map((item, index) => <MovieItemSkeleton key={index} />);
  }, []);

  const renderContent = useCallback(() => {
    if (isInit.current || loading) {
      return <div className="list-of-movies">{renderPreloadState()}</div>;
    }

    if (movies.length === 0) {
      return (
        <div className="empty-content">
          <h2>Oops!</h2>
          <p>Sorry! We couldn't find anything.</p>
        </div>
      );
    }

    return (
      <>
        <div className="list-of-movies">{renderListMovies()}</div>
        <div className="pagination">
          {filter.page > 1 && (
            <Button onClick={handlePrev} disabled={metadata.page === 1}>
              <i className="arrow left"></i>
            </Button>
          )}
          <p>
            <span>Page {filter.page}</span> of <span>{metadata.totalPage}</span>
          </p>
          {filter.page < metadata.totalPage && (
            <Button
              onClick={handleNext}
              disabled={metadata.page === metadata.totalPage}
            >
              <i className="arrow right"></i>
            </Button>
          )}
        </div>
      </>
    );
  }, [isInit.current, movies, filter, metadata, loading]);

  useEffect(() => {
    const fetchData = async () => {
      const moviesReq: any = httpService(getListMovie, METHODS.get);
      const genresReq: any = httpService(getListGenres, METHODS.get);
      setLoading(true);
      /**
       * Fetching movie list and genres
       */
      const [moviesRes, genresRes] = await Promise.all([moviesReq, genresReq]);

      setGenres(mappingGenresById(genresRes.genres));
      setMovies(moviesRes?.results);
      setMetadata({
        page: moviesRes.page,
        totalPage: moviesRes.total_pages,
        totalResult: moviesRes.total_results,
      });
      setGenresOptions(
        genresRes.genres.map((g: GENRE) => ({
          label: g.name,
          value: g.id,
        }))
      );
      setLoading(false);
      isInit.current = false;
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleShowDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="home-page" id="home-page">
      <Filter genres={genresOptions} onConfirm={handleFilter} />

      {renderContent()}

      <div className="backdrop" id="backdrop" onClick={handleBackdropClick}>
        <MovieDetail
          id={selected?.data?.id}
          isShow={selected?.data && true}
          posterUrl={`${IMAGE_HOST}/w400${selected?.data?.backdrop_path}`}
          title={selected?.data?.original_title}
          releaseDate={selected?.data?.release_date}
          genres={selected?.data?.genre_ids.map((id: number) => genres[id])}
          overview={selected?.data?.overview}
          onRendered={handleShowDetail}
        />
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
