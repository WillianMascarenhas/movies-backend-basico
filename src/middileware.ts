import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IMovies } from "./interface";
import { client } from "./database";


const verifyIfNameExists = async (req: Request, res: Response, next: NextFunction) =>{

    const queryString: string = `
    SELECT 
        *
    FROM
        movies;
    `
    const queryResult: QueryResult<IMovies> = await client.query(queryString)

    const findIndex = queryResult.rows.findIndex(movie =>movie.name == req.body.name)

    if(findIndex !== -1){
        return res.status(409).json({
            "error": "Movie name already exists!"
          })
    }
    next()
}

const verifyIfIdExists = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> =>{
    const id:number = parseInt(req.params.id)

    const queryString: string = `
    SELECT 
        *
    FROM
        movies
    WHERE
        id = $1;
    `

    const queryConfig: QueryConfig ={
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

    if(queryResult.rowCount === 0){
        return res.status(404).json({
            "error": "Movie not found!"
          })
    }
    res.locals.movie = queryResult.rows[0]
    return next()
}

const listByCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>{

    const queryString: string = `
    SELECT *
    FROM
        movies
    WHERE
        "category" = $1;
    `
    const queryParams = req.query

    const queryConfig: QueryConfig ={
        text: queryString,
        values: [queryParams.category]
    }

    const queryResult: QueryResult<IMovies> = await client.query(queryConfig)

    if(queryParams.category?.length){
        if(queryResult.rows.length == 0){
            const queryString: string = `
            SELECT *
            FROM
                movies;
            `
            const queryResult: QueryResult<IMovies> = await client.query(queryString)
            return res.json(queryResult.rows)
        }
        return res.status(200).json(queryResult.rows)
    }
    return next()
}

export { verifyIfNameExists, verifyIfIdExists, listByCategory}
