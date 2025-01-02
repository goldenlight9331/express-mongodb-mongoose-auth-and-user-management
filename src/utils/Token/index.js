import { jwt } from '#packages/index.js';
import { handleError, dotEnv } from '#utils/index.js';

const { JWT_SECRET } = dotEnv;

export const generateAuthToken = user => {
  try {
    const { _id, name, email, role } = user;
    const token = jwt.sign(
      {
        id: _id.toString(),
        email,
        name,
        role,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
        algorithm: 'HS256',
      },
    );
    return token;
  } catch (error) {
    return handleError(error, 'Failed to generate token');
  }
};
