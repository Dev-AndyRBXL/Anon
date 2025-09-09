import { signup, login, updateProfile, deleteAccount } from '../src/utils/auth';

(async () => {
  // Sign up
  const signupRes = await signup({
    username: 'andy',
    email: 'andy@mail.com',
    password: 'mypassword123',
  });
  console.log('Signed up:', signupRes);

  // Login
  const loginRes = await login({ username: 'andy', password: 'mypassword123' });
  const token = loginRes.token;

  // Update profile
  const updated = await updateProfile(token, {
    displayname: 'Andy D.',
    description: 'Hello!',
  });
  console.log('Updated profile:', updated);

  // Delete account
  const deleted = await deleteAccount(token);
  console.log('Deleted account:', deleted);
})();
