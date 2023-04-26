import { Request, Response, response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { IMovies, TMoviesResquest } from "./interface";
import format from "pg-format";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const moviesData: TMoviesResquest = req.body;

  const queryString: string = format(
    `
    INSERT INTO
        movies
        (%I)
    VALUES
        (%L)
    RETURNING *;
`,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryResult: QueryResult<IMovies> = await client.query(queryString);

  if (queryResult.rows.length > 1) {
    return res.status(201).json(queryResult.rows);
  }
  return res.status(201).json(queryResult.rows[0]);
};

const listMovies = async (req: Request, res: Response): Promise<Response> => {
  const queryString: string = `
    SELECT 
        *
    FROM
        movies;
    `;
  const queryResult: QueryResult<IMovies> = await client.query(queryString);
  const queryParams = req.query;
  return res.json(queryResult.rows);
};

const listMovieById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const movie: IMovies = res.locals.movie;
  return res.json(movie);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  const queryString: string = `
    DELETE
    FROM
        movies
    WHERE
        id = $1;
    `;

  const movie: IMovies = res.locals.movie;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [movie.id],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  return res.status(204).json();
};

const updateMovie = async (req: Request, res: Response): Promise<Response> => {
  const moviesData: Partial<TMoviesResquest> = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
    UPDATE
        movies
    SET(%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING * ;
  `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig)
  return res.json(queryResult.rows[0]);
};

export { createMovie, listMovies, listMovieById, deleteMovie, updateMovie };
