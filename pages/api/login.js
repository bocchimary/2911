import passport from 'passport';

export default async function handler(req, res) {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: 'Login error' });
      }

      // If authentication is successful, return a success response
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res);
}
