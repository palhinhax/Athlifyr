/**
 * Email Templates for Athlifyr
 * Professional, branded email templates using inline CSS
 */

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function getPasswordResetEmailHtml({
  name,
  resetUrl,
}: PasswordResetEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Password - Athlifyr</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Brand -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                🏃 Athlifyr
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">
                A tua plataforma de desporto
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Olá ${name}! 👋
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Recebemos um pedido para <strong>recuperar a password</strong> da tua conta Athlifyr.
              </p>

              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Clica no botão abaixo para criar uma nova password:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                      Recuperar Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                Ou copia e cola este link no teu navegador:
              </p>

              <div style="padding: 16px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; word-break: break-all;">
                <a href="${resetUrl}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                  ${resetUrl}
                </a>
              </div>

              <div style="margin: 30px 0 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Importante:</strong> Este link expira em <strong>1 hora</strong> e só pode ser usado uma vez.
                </p>
              </div>

              <div style="margin: 30px 0 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0 0 10px; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                  <strong>Não pediste para recuperar a password?</strong>
                </p>
                <p style="margin: 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                  Podes ignorar este email em segurança. A tua password não será alterada.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 15px; color: #6b6b6b; font-size: 14px; text-align: center; line-height: 1.6;">
                Tens dúvidas? Contacta-nos através do nosso <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #667eea; text-decoration: none;">formulário de contacto</a>.
              </p>
              
              <p style="margin: 0; color: #9b9b9b; font-size: 12px; text-align: center; line-height: 1.5;">
                © ${new Date().getFullYear()} Athlifyr. Todos os direitos reservados.<br>
                Este é um email automático, por favor não respondas.
              </p>

              <div style="margin: 20px 0 0; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">
                  🏠 Página Inicial
                </a>
                <span style="color: #d0d0d0;">|</span>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">
                  📅 Eventos
                </a>
                <span style="color: #d0d0d0;">|</span>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">
                  📧 Contacto
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getPasswordResetEmailText({
  name,
  resetUrl,
}: PasswordResetEmailProps): string {
  return `
Olá ${name}!

Recebemos um pedido para recuperar a password da tua conta Athlifyr.

Clica no link abaixo para criar uma nova password:
${resetUrl}

⚠️ IMPORTANTE:
- Este link expira em 1 hora
- Só pode ser usado uma vez
- Se não pediste para recuperar a password, ignora este email

Tens dúvidas? Contacta-nos através de: ${process.env.NEXT_PUBLIC_BASE_URL}/contact

---
© ${new Date().getFullYear()} Athlifyr
Este é um email automático, por favor não respondas.
  `.trim();
}
