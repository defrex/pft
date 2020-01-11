export function fromEntries(iterable: [string, any][]) {
  return [...iterable].reduce(
    (obj, [key, val]) => {
      obj[key] = val
      return obj
    },
    {} as { [key: string]: any },
  )
}
