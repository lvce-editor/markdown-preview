import { parse } from 'marked'

export const render = async (content: string): Promise<string> => {
  return parse(content)
}
