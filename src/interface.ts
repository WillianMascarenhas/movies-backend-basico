interface IMovies {
    id: number,
    name: string,
    category: string,
    duration: number,
    price: number
}

type TMoviesResquest = Omit<IMovies, "id">

export { IMovies, TMoviesResquest }