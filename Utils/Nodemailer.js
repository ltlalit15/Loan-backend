import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'credit@ladybuglending.com',
    pass: 'omkd ljzx oopl edqu', 
  },
});

export default transporter;
