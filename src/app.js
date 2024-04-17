import express from 'express'
import cors from 'cors'

export const app = express()

app.use(cors())

app.get('/', (req, res) => res.json({ status: 'success', payload: 'ok' }))

app.listen(8080, () => console.log('Server Up!'))