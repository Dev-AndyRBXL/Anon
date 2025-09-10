import { useEffect } from 'react';
import { signup, login, updateProfile, deleteProfile } from './services/apiService'; // Test
import logger from './utils/logger';

function App() {
  useEffect(() => {
    const runAuthFlow = async () => { // Test
      try {
        const uniqueSuffix = Date.now(); // Not necessary; just added it for now
        const username = `andy${uniqueSuffix}`;
        const email = `andy${uniqueSuffix}@mail.com`;
        const password = 'mypassword123';

        const signupRes = await signup({ username, email, password });
        if (!signupRes.success) {
          console.error('Signup failed:', signupRes.message, signupRes.errors);
          return;
        }
        logger.info({ signupRes }, 'Signed up successfully');

        const loginRes = await login({ identifier: username, password });
        if (!loginRes.success || !loginRes.accessToken) {
          return logger.error(
            { message: loginRes.message, errors: loginRes.errors },
            'Login failed'
          );
        }
        logger.info({ loginRes }, 'Logged in successfully');
        const token = loginRes.accessToken;

        const updated = await updateProfile(token, {
          displayname: 'Andy D.',
          description: 'Hello!',
        });
        if (!updated.success) {
          return logger.error(
            { message: updated.message, errors: updated.errors },
            'Profile update failed'
          );
        }
        logger.info({ updated }, 'Profile updated successfully');

        const deleted = await deleteProfile(token);
        if (!deleted.success) {
          return logger.error(
            { message: deleted.message, errors: deleted.errors },
            'Account deletion failed'
          );
        }
        logger.info({ deleted }, 'Account deleted successfully');
      } catch (err) {
        logger.error(err, 'Unexpected auth error');
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
