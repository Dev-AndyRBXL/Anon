import { Sequelize } from 'sequelize';
import { expect, test } from 'vitest';
import userModel from '../src/models/user.model';

test('creates user and validates it', async () => {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });
  const User = userModel(sequelize, Sequelize);
  await sequelize.sync({ force: true });

  const user = await User.create({
    username: 'andy',
    password: 'mypassword123',
    email: 'example@mail.com',
  });

  expect(user.username).toBe('andy');
  expect(user.email).toBe('example@mail.com');
  expect(user.password).toMatch(/^\$2[aby]\$.{56}$/);

  const deletedUser = await user.destroy();
  console.warn('Destroyed user:', deletedUser);
});
