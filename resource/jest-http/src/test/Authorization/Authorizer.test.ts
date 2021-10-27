import { Authorizer } from '../../app/Authorization/Authorizer';
import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
import { UserCredentialsDbAccess } from '../../app/Authorization/UserCredentialsDbAccess';
import { Account, SessionToken } from '../../app/Models/ServerModels';

jest.mock('../../app/Authorization/SessionTokenDBAccess');
jest.mock('../../app/Authorization/UserCredentialsDbAccess');

describe('Authorizer test suite', () => {
  let authorizer: Authorizer;

  const someAccount: Account = {
    username: 'someUser',
    password: 'password'
  };

  const sessionTokenDBAccessMock = {
    storeSessionToken: jest.fn()
  };

  const userCredentialsDBAccessMock = {
    getUserCredential: jest.fn()
  };

  beforeEach(() => {
    authorizer = new Authorizer(
      sessionTokenDBAccessMock as any,
      userCredentialsDBAccessMock as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('constructor arguments', () => {
    new Authorizer();
    expect(SessionTokenDBAccess).toBeCalled();
    expect(UserCredentialsDbAccess).toBeCalled();
  });

  test.only('should return sessionToken for valid credentials', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValueOnce(0);
    jest.spyOn(global.Date, 'now').mockReturnValueOnce(0);
    userCredentialsDBAccessMock.getUserCredential.mockResolvedValueOnce({
      username: 'someUser',
      accessRights: [1, 2, 3]
    });

    const expectedSessionToken: SessionToken = {
      userName: 'someUser',
      accessRights: [1, 2, 3],
      valid: true,
      tokenId: '',
      expirationTime: new Date(60 * 60 * 1000)
    };

    const sessionToken = await authorizer.generateToken(someAccount);
    expect(expectedSessionToken).toEqual(sessionToken);
    expect(sessionTokenDBAccessMock.storeSessionToken).toBeCalledWith(
      sessionToken
    );
  });
});
