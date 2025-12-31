
const GAME_ID = "6954cf37fb0fd703680b575d"
const PLAYER_ID = "6954cea0fb0fd703680b5752"

const url = `http://localhost:5000/api/games/${GAME_ID}/rollDice`

const body = { playerId: PLAYER_ID }

fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))
