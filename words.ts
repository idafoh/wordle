const defaultMessage = 'Use word of the day instead.'

export function getWordOfTheDay(answers: string[]) {
  const route = useRoute()

  if (typeof route.query.w === 'string') {
    let word = route.query.w as string
    word = decodeURIComponent(word)

    try {
      const query = atob(word)
      if (query.length !== 5) {
        alert(`Incorrect word length from encoded query. ${defaultMessage}`)
      } else {
        return query
      }
    } catch (e) {
      alert(`Malformed encoded word query. ${defaultMessage}`)
    }
  }

  const now = new Date()
  const start = new Date(2022, 0, 0)
  const diff = Number(now) - Number(start)
  let day = Math.floor(diff / (1000 * 60 * 60 * 24))
  while (day > answers.length) {
    day -= answers.length
  }
  return answers[day]
}
