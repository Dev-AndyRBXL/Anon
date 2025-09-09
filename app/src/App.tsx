import { useEffect } from 'react';
import { signup, login, updateProfile, deleteAccount } from './utils/auth';

function App() {
  useEffect(() => {
    const runAuthFlow = async () => {
      try {
        const signupRes = await signup({
          username: 'andy',
          email: 'andy@mail.com',
          password: 'mypassword123',
        });
        console.log('Signed up:', signupRes);

        const loginRes = await login({
          username: 'andy',
          password: 'mypassword123',
        });
        console.log('Logged in:', loginRes);
        const token = loginRes.token;

        const updated = await updateProfile(token, {
          displayname: 'Andy D.',
          description: 'Hello!',
        });
        console.log('Updated profile:', updated);

        const deleted = await deleteAccount(token);
        console.log('Deleted account:', deleted);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Auth error:', err.message);
      }
    };

    runAuthFlow();
  }, []);

  return (
    <div>
      <p>Check the console for results</p>
    </div>
  );
}

export default App;
