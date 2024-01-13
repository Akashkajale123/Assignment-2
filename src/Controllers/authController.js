const bcrypt = require('bcrypt');
const dotEnv=require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
dotEnv.config();

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ status: 'success', message: 'User registered successfully',UserData:{newUser} });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Generate JWT token
    console.log('key',process.env.KEY)
    const token = jwt.sign({ userId: user._id },process.env.KEY, { expiresIn: '1h' });

    return res.status(200).json({ status: 'success', message: 'Login successful', Token:token,userData:{ Id: user._id, name: user.name} });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
