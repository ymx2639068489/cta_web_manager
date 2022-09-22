const desensitization = [
  'password',
  'createdAt',
  'updatedAt',
  'deletedAt',
]

export function desensitizationFn(data: any): any {
  let res: any;
  if (Array.isArray(data)) res = []
  else res = {}
  for (const key in data) {

    if (desensitization.includes(key)) continue;
    
    if (typeof data[key] === 'object') {
      if (data[key] === null) {
        res[key] = null
        continue
      }
      res[key] = desensitizationFn(data[key])
      continue
    }
    res[key] = data[key]
  }
  return res
}