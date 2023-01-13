import { faker } from '@faker-js/faker';

export const generateMockUser = () => ({
  email: faker.internet.email(),
  name: faker.name.fullName(),
  password: faker.internet.password(),
});

export const validJWT = (token: string) => {
  const jwtRegex = /^([\w=]+)\.([\w=]+)\.([\w\-\+\/=]*)/;
  return jwtRegex.test(token);
};