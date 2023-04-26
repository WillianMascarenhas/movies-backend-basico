import express, { Application } from "express";
import { startDataBase } from "./database";
import { createMovie, deleteMovie, listMovieById, listMovies, updateMovie } from "./logic";
import { listByCategory, verifyIfIdExists, verifyIfNameExists } from "./middileware";

const app: Application = express();
app.use(express.json());

app.post("/movies", verifyIfNameExists, createMovie)
app.get("/movies", listByCategory, listMovies)
app.get("/movies/:id", verifyIfIdExists, listMovieById)
app.delete("/movies/:id", verifyIfIdExists, deleteMovie)
app.patch("/movies/:id", verifyIfIdExists, verifyIfNameExists, updateMovie)

app.listen(3000, async () =>{
    await startDataBase()
    console.log("Server is running, on port 3000")
})

