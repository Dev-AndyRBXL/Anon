import { Sequelize } from 'sequelize';
import { expect, test, afterAll } from 'vitest';
import userModel from '../src/models/user.model';

test('creates user, validates fields, and deletes it', async () => {
  // In-memory SQLite database
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });
  const User = userModel(sequelize, Sequelize);

  await sequelize.sync({ force: true });

  // Create user
  const user = await User.create({
    username: 'andy',
    password: 'mypassword123',
    email: 'example@mail.com',
  });

  // Assertions
  expect(user.username).toBe('andy');
  expect(user.email).toBe('example@mail.com');
  // Password should be hashed
  expect(user.password).toMatch(/^\$2[aby]\$.{56}$/);

  // Delete user
  await user.destroy();

  // Check user is removed from DB
  const found = await User.findByPk(user.id);
  expect(found).toBeNull();
  
  // Close connection
  await sequelize.close();
});
