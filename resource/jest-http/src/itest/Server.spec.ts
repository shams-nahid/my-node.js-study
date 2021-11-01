import * as axios from 'axios';
import { UserCredentialsDbAccess } from '../app/Authorization/UserCredentialsDbAccess';
import { HTTP_CODES, UserCredentials } from '../app/Models/ServerModels';

axios.default.defaults.validateStatus = () => true;

const serverUrl = 'http://localhost:8080';

const itestUserCredentials: UserCredentials = {
  accessRights: [1, 2, 3],
  password: 'iTestPassword',
  username: 'iTestUser'
};

describe('Server itest suite', () => {
  let userCredentialsDBAccess: UserCredentialsDbAccess;

  beforeAll(() => {
    userCredentialsDBAccess = new UserCredentialsDbAccess();
  });

  test('server reachable', async () => {
    const response = await axios.default.options(serverUrl);
    expect(response.status).toBe(HTTP_CODES.OK);
  });

  // test('put credentials inside database', async () => {
  //   await userCredentialsDBAccess.putUserCredential(itestUserCredentials);
  // });

  test('reject invalid credentials', async () => {
    const response = await axios.default.post(serverUrl + '/login', {
      username: 'someWrongCred',
      password: 'someWrongPass'
    });
    expect(response.status).toBe(HTTP_CODES.NOT_fOUND);
  });

  test('successful login with valid credentials', async () => {
    // await userCredentialsDBAccess.putUserCredential(itestUserCredentials);
    const response = await axios.default.post(serverUrl + '/login', {
      username: itestUserCredentials.username,
      password: itestUserCredentials.password
    });
    expect(response.status).toBe(HTTP_CODES.CREATED);
  });
});

async function serverReachable(): Promise<boolean> {
  try {
    await axios.default.get(serverUrl);
  } catch (error) {
    console.log('Server not reachable');
    return false;
  }
  console.log('Server reachable');
  return true;
}
