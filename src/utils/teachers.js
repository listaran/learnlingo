export const matchesFilters = (teacher, filters) => {
  const { language, level, price } = filters
  return (
    (!language || teacher.languages.includes(language)) &&
    (!level || teacher.levels.includes(level)) &&
    (!price || teacher.price_per_hour <= Number(price))
  )
}
