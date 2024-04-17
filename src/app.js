import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

export const app = express()

app.use(cors())

const tokenSign = async(user) => {
  return jwt.sign(
    { user },
    'process.env.JWT_SECRET',
    {
      expiresIn: 180,
    }
  );
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, 'process.env.JWT_SECRET');
  } catch (e) {
    return undefined;
  }
};

const checkAuth = async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
          res.status(403).json({ status: 'error', error: "NOT_ALLOWED" })
          return;
      }
      const token = req.headers.authorization.split(" ").pop();
      const tokenData = await verifyToken(token);
      if (tokenData?.user._id) {
            req.user = tokenData
            next();
      } else {
        res.status(403).json({ status: 'error', error: 'TOKEN_EXPIRED_OR_NOT_VALID' })
        return 
      }
    } catch (e) {
      console.log(e.message)
      return res.status(500).json({ status: 'error', error: 'SERVER_ERROR' })
    }
  };

app.get('/api/login', async (req, res) => {
    const user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Alex',
        lastname: 'Marin Mendez',
        email: 'alexmarinmendez@gmail.com'
    }
    const token = await tokenSign(user)
    res.json({ status: 'success', payload: { token, user } })
})

app.get('/api/profile', checkAuth, (req, res) => {
    res.json({ status: 'success', payload: req.user.user })
})

app.get('/api/logout', (req, res) => {
    req.user = undefined
    res.json({ status: 'success', message: 'Sign out successfully!' });
  })

app.listen(8080, () => console.log('Server Up!'))