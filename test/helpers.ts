import { faker } from '@faker-js/faker';

export const generateMockUser = () => ({
  // Hacky code to force unique emails
  email: (new Date().getTime() + '') + faker.internet.email(),
  name: faker.name.fullName(),
  password: faker.internet.password(),
});

export const jwtRegex = /^([\w=]+)\.([\w=]+)\.([\w\-\+\/=]*)$/;

export const isValidJWT = (token: string) => {
  return jwtRegex.test(token);
};