import type { Express, Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { IStorage } from "../storage";

// Email service - using GHL for now (can switch to SendGrid/Resend later)
async function sendVerificationEmail(email: string, token: string, baseUrl: string) {
  const verificationUrl = `${baseUrl}/verify-email/${token}`;
  
  // TODO: Integrate with GHL email workflow
  // For now, just log the URL (in production, this should send actual email)
  console.log(`🔔 Verification Email for ${email}:`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log(`Token: ${token}`);
  
  // Email template
  const emailContent = {
    to: email,
    from: 'saints@hacp.ai',
    subject: '✅ Verify Your Email - Saint Vision Group',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1d1d1f;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            color: #1d1d1f;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1d1d1f;
          }
          .button {
            display: inline-block;
            background: #1d1d1f;
            color: #ffd700;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid rgba(0,0,0,0.1);
            font-size: 14px;
            color: #666;
          }
          .token {
            background: rgba(0,0,0,0.05);
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            margin: 10px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡️ Saint Vision Group</div>
          <div class="title">Verify Your Email Address</div>
          
          <p>Welcome to Saint Vision Group! We're excited to have you on board.</p>
          
          <p>Click the button below to verify your email address and activate your account:</p>
          
          <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <div class="token">${verificationUrl}</div>
          
          <p><strong>This verification link expires in 24 hours.</strong></p>
          
          <div class="footer">
            <p>If you didn't create an account with Saint Vision Group, please ignore this email.</p>
            <p>Questions? Contact us at <a href="mailto:support@cookin.io">support@cookin.io</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  // Return the email content for logging/integration
  return emailContent;
}

async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
  const resetUrl = `${baseUrl}/reset-password/${token}`;
  
  console.log(`🔔 Password Reset Email for ${email}:`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`Token: ${token}`);
  
  const emailContent = {
    to: email,
    from: 'saints@hacp.ai',
    subject: '🔐 Reset Your Password - Saint Vision Group',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1d1d1f;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            color: #1d1d1f;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1d1d1f;
          }
          .button {
            display: inline-block;
            background: #1d1d1f;
            color: #ffd700;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ff9500;
            padding: 12px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid rgba(0,0,0,0.1);
            font-size: 14px;
            color: #666;
          }
          .token {
            background: rgba(0,0,0,0.05);
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            margin: 10px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡️ Saint Vision Group</div>
          <div class="title">Reset Your Password</div>
          
          <p>You requested to reset your password for your Saint Vision Group account.</p>
          
          <p>Click the button below to create a new password:</p>
          
          <a href="${resetUrl}" class="button">🔐 Reset Password</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <div class="token">${resetUrl}</div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            This password reset link expires in 1 hour.<br>
            If you didn't request this reset, please ignore this email and your password will remain unchanged.
          </div>
          
          <div class="footer">
            <p>For security reasons, never share this link with anyone.</p>
            <p>Questions? Contact us at <a href="mailto:support@cookin.io">support@cookin.io</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  return emailContent;
}

export function registerEmailVerificationRoutes(app: Express, storage: IStorage) {
  
  // 1. Send verification email (called during signup or resend)
  app.post("/api/auth/send-verification", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if already verified
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      // Generate verification token (32 bytes = 64 hex characters)
      const token = randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // 24 hour expiry
      
      // Save token to database
      await storage.updateUserVerificationToken(user.id, token, expires);
      
      // Send verification email
      const baseUrl = process.env.FRONTEND_URL || 'https://saintvisionai.com';
      const emailContent = await sendVerificationEmail(user.email!, token, baseUrl);
      
      // TODO: Actually send email via GHL or SendGrid
      // For now, we're just logging it
      
      res.json({ 
        message: "Verification email sent successfully",
        // In dev mode, return the token for testing
        ...(process.env.NODE_ENV === 'development' ? { token, verificationUrl: `${baseUrl}/verify-email/${token}` } : {})
      });
      
    } catch (error) {
      console.error('Send verification error:', error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });
  
  // 2. Verify email via token
  app.get("/api/auth/verify-email/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ error: "Verification token is required" });
      }
      
      // Find user by verification token
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(404).json({ error: "Invalid verification token" });
      }
      
      // Check if token expired
      if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
        return res.status(400).json({ error: "Verification token has expired" });
      }
      
      // Check if already verified
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      // Mark email as verified
      await storage.updateUserEmailVerified(user.id, true);
      
      res.json({ 
        message: "Email verified successfully",
        user: {
          id: user.id,
          email: user.email,
          emailVerified: true
        }
      });
      
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });
  
  // 3. Resend verification email
  app.post("/api/auth/resend-verification", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: "If the email exists, a verification email has been sent" });
      }
      
      // Check if already verified
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      // Generate new verification token
      const token = randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      
      // Save new token
      await storage.updateUserVerificationToken(user.id, token, expires);
      
      // Send verification email
      const baseUrl = process.env.FRONTEND_URL || 'https://saintvisionai.com';
      await sendVerificationEmail(user.email!, token, baseUrl);
      
      res.json({ message: "Verification email resent successfully" });
      
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ error: "Failed to resend verification email" });
    }
  });
  
  // 4. Request password reset
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: "If the email exists, a password reset email has been sent" });
      }
      
      // Generate password reset token
      const token = randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 1 hour expiry (shorter than email verification)
      
      // Save token to database
      await storage.updateUserPasswordResetToken(user.id, token, expires);
      
      // Send password reset email
      const baseUrl = process.env.FRONTEND_URL || 'https://saintvisionai.com';
      const emailContent = await sendPasswordResetEmail(user.email!, token, baseUrl);
      
      // TODO: Actually send email via GHL or SendGrid
      
      res.json({ 
        message: "Password reset email sent successfully",
        // In dev mode, return the token for testing
        ...(process.env.NODE_ENV === 'development' ? { token, resetUrl: `${baseUrl}/reset-password/${token}` } : {})
      });
      
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: "Failed to send password reset email" });
    }
  });
  
  // 5. Reset password with token
  app.post("/api/auth/reset-password/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Reset token is required" });
      }
      
      if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      
      // Find user by reset token
      const user = await storage.getUserByPasswordResetToken(token);
      if (!user) {
        return res.status(404).json({ error: "Invalid reset token" });
      }
      
      // Check if token expired
      if (user.passwordResetExpires && new Date() > new Date(user.passwordResetExpires)) {
        return res.status(400).json({ error: "Reset token has expired" });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password and clear reset token
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.updateUserPasswordResetToken(user.id, null, null);
      
      res.json({ 
        message: "Password reset successfully",
        user: {
          id: user.id,
          email: user.email
        }
      });
      
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
}
