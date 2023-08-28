const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema, loginSchema } = require('../helpers/validation_schema')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')
const passport = require('passport')
const privateKey = process.env.GITHUB_PRIVATE_KEY
const appId = process.env.GITHUB_APP_ID

module.exports = {
  googleAuth: async (req, res) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })
  },
  googleCallback: passport.authenticate('google', { failureRedirect: '/auth/login' }), async function(err, user) {
    try {
      // Assuming the authenticated user is stored in req.user
      const user = req.user;

      // Generate access token and refresh token
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      // Save the tokens to Redis
      const client = redis.createClient({ url: keys.redisURL });
      const userKey = user.id.toString();
      client.set(userKey, JSON.stringify({ accessToken, refreshToken }), 'EX', 21600);

      // Return tokens to the client
      res.status(200).json({ userKey, refreshToken, accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  githubAuth: async (req, res) => {
    passport.authenticate('github')
  },
  githubCallback: passport.authenticate('github', { failureRedirect: '/auth/login' }), async function(req, res) {
    try {
      // Assuming the authenticated user is stored in req.user
      const user = req.user;

      // Generate access token and refresh token
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      // Save the tokens to the user's document in MongoDB
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();

      // Return tokens to the client
      res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  register: async (req, res, next) => {
    try {
      // const { email, password } = req.body
      // if (!email || !password) throw createError.BadRequest()
      const { firstname, lastname, email, password, confirmedpassword } = req.body;
      const result = await authSchema.validateAsync({
        firstname,
        lastname,
        email,
        password,
        confirmedpassword
      });

      const doesExist = await User.findOne({ email: result.email })
      if (doesExist) {
        throw createError.Conflict(`${result.email} is already been registered`)
      }
      if (result.password !== result.confirmedpassword) {
        throw createError.BadRequest('Password and confirmed password do not match');
      }
      const user = new User({
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        password: result.password
      });
      const savedUser = await user.save()
      const accessToken = await signAccessToken(savedUser.id)
      const refreshToken = await signRefreshToken(savedUser.id)

      res.send({ accessToken, refreshToken })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body)
      const user = await User.findOne({ email: result.email }).select("+password")
      if (!user) throw createError.NotFound('User not registered')

      const isMatch = await user.isValidPassword(result.password)
      // const isMatch = await bcrypt.compare(result.password, user.password);
      if (!isMatch)
        throw createError.Unauthorized('Username/password not valid')

      const accessToken = await signAccessToken(user.id)
      const refreshToken = await signRefreshToken(user.id)

      res.send({ accessToken, refreshToken })
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message)
          throw createError.InternalServerError()
        }
        console.log(val)
        res.sendStatus(204)
      })
    } catch (error) {
      next(error)
    }
  },
  selectType: async (req, res) => {
    const { user, userType } = req.body;
    try{
      const existingUser = await User.findOne({ id: user });
      if (!existingUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      existingUser.userType = userType;
      await existingUser.save();
      return res.status(200).json({ message: 'User type saved successfully' });
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  selectHosting: async (req, res) => {
    const { user, userHosting } = req.body;
    try{
      const existingUser = await User.findOne({ id: user });
      if (!existingUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      existingUser.userType = userHosting;
      await existingUser.save();
      return res.status(200).json({ message: 'User hosting saved successfully' });
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  repositoryFetch: async (req, res) => {
    const { user } = req.body;
    try {
      // Create an Octokit instance with the dynamic import of fetch
      let fetch;
      (async () => {
        const fetchModule = await import('node-fetch');
        fetch = fetchModule.default;
  
        const clientToken = jwt.sign({}, privateKey, {
          algorithm: 'RS256',
          expiresIn: '1m', // Set an appropriate expiration
          issuer: appId, // Replace with your GitHub App's app ID
        });
  
        const octokit = new Octokit({
          auth: `Bearer  ${clientToken}`, // Replace with your GitHub App's client ID
          request: {
            fetch: fetch, // Provide the dynamic fetch implementation
          },
        });
  
        // Use the octokit instance to make requests
        try {
          const response = await octokit.request('GET /users/{username}/repos', {
            username: user,
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            }
          });
  
          // Response data is already parsed JSON, no need for additional parsing
          console.log(response.data);
          return res.status(200).json({ response: response.data });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Error fetching repository data' });
        }
      })();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
