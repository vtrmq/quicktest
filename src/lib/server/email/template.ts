export const emailTemplates = {
  welcome: (name: string, verificationLink?: string) => ({
    subject: `¡Bienvenido a nuestra plataforma, ${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .wrapper-template { box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; margin: 20px auto; max-width: 600px; }
          .container { padding: 10px; background: #ffffff;}
          .header { background: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3498db; 
                   color: white !important; text-decoration: none; border-radius: 4px; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="wrapper-template">
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido!</h1>
          </div>
          <div class="content">
            <h2>Hola ${name},</h2>
            <p>Gracias por registrarte en nuestra plataforma educativa.</p>
            ${verificationLink ? `
            <p>Para activar tu cuenta, haz clic en el siguiente botón:</p>
            <p style="text-align: center;">
              <a href="${verificationLink}" class="button">Activar Mi Cuenta</a>
            </p>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <code>${verificationLink}</code></p>
            ` : ''}
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Tu Plataforma Educativa. Todos los derechos reservados.</p>
          </div>
        </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: 'Restablece tu contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Restablecer Contraseña</h2>
        <p>Hola ${name},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <p><a href="${resetLink}" style="background: #e74c3c; color: white; padding: 10px 20px; 
           text-decoration: none; border-radius: 4px;">Restablecer Contraseña</a></p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este email.</p>
      </div>
    `
  }),

  loginNotification: (name: string, device: string, location: string) => ({
    subject: 'Nuevo inicio de sesión detectado',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f39c12;">Nuevo Inicio de Sesión</h2>
        <p>Hola ${name},</p>
        <p>Se detectó un nuevo inicio de sesión en tu cuenta:</p>
        <ul>
          <li><strong>Dispositivo:</strong> ${device}</li>
          <li><strong>Ubicación:</strong> ${location}</li>
          <li><strong>Fecha:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>Si no reconoces esta actividad, por favor cambia tu contraseña inmediatamente.</p>
      </div>
    `
  })
};
