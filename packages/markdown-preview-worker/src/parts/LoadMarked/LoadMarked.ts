export const loadMarked = async (markedUrl: string) => {
  const module = await import(markedUrl)
  return module
}
