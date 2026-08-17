export const invoke = async (method: string, ...params: any[]): Promise<any> => {
  const url = await globalThis.rpc.invoke(method, ...params)
  return url
}
