import { faker } from '@faker-js/faker'

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  website: string
  company: string
  createdAt: Date
}

export type UserApiResponse = {
  data: User[]
  meta: {
    totalRowCount: number
  }
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newUser = (index: number): User => {
  return {
    id: index + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url(),
    company: faker.company.name(),
    createdAt: faker.date.anytime()
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): User[] => {
    const len = lens[depth]!
    return range(len).map((d): User => {
      return {
        ...newUser(d)
      }
    })
  }

  return makeDataLevel()
}

const data = makeData(1000)

export const fetchData = async (start: number, size: number) => {
  const dbData = [...data]

  await new Promise((resolve) => setTimeout(resolve, 200))

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length
    }
  }
}
