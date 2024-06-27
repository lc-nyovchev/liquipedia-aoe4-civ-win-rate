const getGames = () => {
	return document.getElementsByClassName('brkts-match-info-popup')
}

const getGameResult = (gameSpan, player1, player2) => {
	const draftFactionsSpans = gameSpan.getElementsByClassName('draft')

	if (draftFactionsSpans.length === 0) {
		return null
	}
	const civ1 = draftFactionsSpans[0].getElementsByTagName('a')[0].title
	const civ2 = draftFactionsSpans[1].getElementsByTagName('a')[0].title

	if (civ1 === 'Unknown' || civ2 === 'Unknown') {
		return null
	}
	const win1 = gameSpan.getElementsByClassName('brkts-popup-spaced')[0].getElementsByClassName('forest-green-text')

	if (win1.length === 0) {
		return {
			winner: player2,
			loser: player1,
			winnerCiv: civ2,
			loserCiv: civ1
		}
	}
	return {
		winner: player1,
		loser: player2,
		winnerCiv: civ1,
		loserCiv: civ2
	}
}

const getGameInfo = (game) => {
	try {
		const playersSpan = game.getElementsByClassName('name')
		const player1 = playersSpan[0].getElementsByTagName('a')[0].title
		const player2 = playersSpan[1].getElementsByTagName('a')[0].title
		const gameSpans = game.getElementsByClassName('brkts-popup-body-game')
		const games = []
		for (let i = 0; i < gameSpans.length; i++) {
			const gameSpan = gameSpans[i]

			const result = getGameResult(gameSpan, player1, player2)
			if (result) {
				games.push(result)
			}
		}
		return {
			games: games
		}
	} catch (e) {
		return null
	}
}

const getGameResults = (game) => {
	return getGameInfo(game)
}

const games = getGames()
const results = []
for (let i = 0; i < games.length; i++) {
	const result = getGameResults(games[i])
	if (result) {
		results.push(result)
	}
}

const summaryByCiv = (results) => {
	const civInfo = {}
	results.forEach((result) => {
		result.games.forEach((game) => {
			const winner = game.winnerCiv
			const loser = game.loserCiv
			if (!civInfo[winner]) {
				civInfo[winner] = { wins: 1, loses: 0 }
			} else {
				civInfo[winner].wins++
			}
			if (!civInfo[loser]) {
				civInfo[loser] = { wins: 0, loses: 1 }
			} else {
				civInfo[loser].loses++
			}
		})
	})
	Object.keys(civInfo).forEach((civ) => {
		const civData = civInfo[civ]
		civData.winLossRatio = (civData.wins / (civData.wins + civData.loses)).toFixed(2)
	})
	civInfo._rawData = results
	return civInfo
}

console.log(summaryByCiv(results))
