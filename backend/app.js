require('dotenv').config();
const express = require("express");
const User = require("./mongo");
const nodemailer = require('nodemailer');// new
const bcrypt = require('bcryptjs');// new
const jwt = require('jsonwebtoken');// new
const cors = require("cors");
const app = express();
const PORT = 8000; // new add
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', "POST"],
  credentials: true // allow cookies
}));



app.get("/", cors(), (req, res) => {
  // Handle your GET request logic here
});

app.post("/", async (req, res) => {
  const { email, password, isEmployee } = req.body;


// newly add 
try {
  // Query to find user
  const user = await User.findOne({ email });
  
  if (!user) {
      return res.status(404).json({ status: 'notexist' });
  }
  
  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
      return res.status(401).json({ status: 'notexist' });
  }
  
  if (isEmployee && user.role === "employee") {
    res.status(200).json({ status: "exist", role: "employee", name: user.name });
  } else if (!isEmployee && user.role === "admin") {
    res.status(200).json({ status: "exist", role: "admin", name: user.name });
  } else {
    res.status(401).json({ status: "notexist" });
  }

  // Successful login
  // res.status(200).json({ status: 'exist', name: user.name, role: user.role });
} catch (error) {
  console.error('Error logging in user:', error);
  res.status(500).json({ status: 'error', message: 'Server error' });
}
})


app.post("/signup", async (req, res) => {
  const { name, email, employeeId, role, mobile, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.json({status: "exist"});
    }
    if (role === 'admin'){
      const adminCount = await User.countDocuments({role: 'admin'});
      if (adminCount >= 3){
        return res.json({status:"admin_limit_reached"})
      }
    } 
      const newUser = new User({
        name: name,
        email: email,
        employeeId: employeeId,
        role: role,
        mobile: mobile,
        password: hashedPassword
      });

      await newUser.save();
      res.json({status: "notexist"});
    }
    
   catch (e) {
    console.error("Error:", e);
    res.json({status: "error"});
  }
});

// new forgot password thing
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.NODE_USER,
    pass: process.env.NODE_PASS,
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email});

  if(!user){
    return res.status(400).json({message: 'User not found'})
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const token = jwt.sign({email, verificationCode: otp}, SECRET_KEY, {expiresIn: '1h'})

  user.verificationCode = otp;
  console.log('user before saying verification:', user)
  await user.save();
  console.log('User after saing verification code:', user)

  const mailOptions = {
    from: process.env.NODE_USER,
    to: email,
    subject: "password Reset OTP",
    text: `Your otp is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({message: 'Error sending email'})
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({token});
  });
});

app.post('/otp-verify', (req, res) => {
  const { otp, token } = req.body;
  console.log('received OTP:', otp);
  console.log('Received Token:', token);

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }
  try {
  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err) //night ko add
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }
    console.log('Decoded token:', decoded);  // night ko add kiya
    // night ko add kiya
    User.findOne({email: decoded.email})
      .then(user => {
        if (!user) {
          console.error('user not found', decoded.email)
          return res.status(400).json({success: false, message: 'user not found'})
        }
        console.log('User verification code:', user.verificationCode);
        console.log('Provided OTP:', otp);


        if (user.verificationCode === parseInt(otp)) { //ensure the otp comparision is correct
          //res.json({ success: true, message: 'OTP verified successfully'})
          user.verificationCode = undefined;
          user.save()
            
          res.json({ success: true, message: 'OTP verified successfully'})
           
        } else {
          res.status(400).json({ success: false, message: 'Invalid OTP'})
        }
      })
      .catch(findErr => {
        console.error('Error finding user:', findErr);
        res.status(500).json({ success: false, message: "Internal server error"})
      });
  });
} catch (error) {
  console.error('Error verifying OTP:', error);
  res.status(500).json({ success: false, message: 'An error occurred while verifying OTP' });
}
})

app.post('/resend-otp', async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email});

  if(!user){
    return res.status(400).json({message: 'User not found'})
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const token = jwt.sign({email, verificationCode: otp}, SECRET_KEY, {expiresIn: '1h'})

  user.verificationCode = otp;
  console.log('user before saying verification:', user)
  await user.save();
  console.log('User after saing verification code:', user)

  const mailOptions = {
    from: process.env.NODE_PASS,
    to: email,
    subject: "password Reset OTP",
    text: `Your otp is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({message: 'Error sending email'})
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({token});
  });
});



// app.post('/reset-password', async(req, res) => {
//   const { email, newPassword } = req.body;
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await User.updateOne({ email }, { $set: { password: hashedPassword } });
//   res.status(200).json({message: 'Password reset succesfully'})
// })

app.post('/reset-password', async(req, res) => {
  const {token, newPassword} = req.body;  /// get the token and the new Password

  try{
    const decode = jwt.verify(token, SECRET_KEY); // ye verify krenga token phir usse user details nikalenga
    const email = decode.email;  // ye token se email get krenga

    const user = await User.findOne({email}); // it will find the email from the database

    if(!user) {
      return res.status(400).json({ message: 'User not found'}) // agar user found nhi hua to ye return krenga
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    // update teh user's password
    user.password = hashedPassword;
    await user.save(); /// ye save krenga changes ko

    res.status(200).json({message: 'Password updated successfully'}); // success response bhejenga

  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(400).json({
      message:'Invalid or expired token'  // unsuccessful reesponse bhejenga
    })
  }
})


app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
// yha tak


