import { Client } from "pg";

const client: Client = new Client({
    user: 'USER',
    host: 'localhost',
    port: 5432,
    password: '1234',
    database: 'entrega_sp2'
})

const startDataBase = async (): Promise<void> =>{
    await client.connect()
    console.log("Database connected")
}

export { client, startDataBase }