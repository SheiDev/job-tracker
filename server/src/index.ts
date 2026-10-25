import 'dotenv/config'
import app from './app.js'
import { connectDb } from './config/db.js'

const port = Number(process.env.PORT) || 4000

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET. Copia server/.env.example a server/.env y cambia el secreto.')
  process.exit(1)
}

if (!process.env.MONGODB_URI) {
  console.error('Falta MONGODB_URI. Copia server/.env.example a server/.env.')
  process.exit(1)
}

await connectDb(process.env.MONGODB_URI)

app.listen(port, () => {
  console.log(`API de Slate en http://localhost:${port}`)
})
