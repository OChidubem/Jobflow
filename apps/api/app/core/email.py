import urllib.request
import urllib.error
import json

from app.core.config import settings


def send_password_reset_email(to_email: str, reset_token: str) -> None:
    if not settings.resend_api_key:
        print(f"[DEV] Password reset token for {to_email}: {reset_token}")
        return

    reset_url = f"{settings.app_url}/reset-password?token={reset_token}"

    payload = json.dumps({
        "from": "Jobflow <noreply@jobflow.app>",
        "to": [to_email],
        "subject": "Reset your Jobflow password",
        "html": f"""
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
            <div style="width:36px;height:36px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:10px;display:flex;align-items:center;justify-content:center">
              <span style="color:white;font-size:18px">⚡</span>
            </div>
            <span style="font-size:20px;font-weight:700;color:#111">Jobflow</span>
          </div>
          <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px">Reset your password</h1>
          <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 28px">
            We received a request to reset your password. Click the button below — this link expires in <strong>15 minutes</strong>.
          </p>
          <a href="{reset_url}"
             style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;font-weight:600;font-size:15px;border-radius:12px;text-decoration:none">
            Reset password →
          </a>
          <p style="color:#9ca3af;font-size:13px;margin-top:28px">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>
        </div>
        """,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        print(f"[EMAIL ERROR] {e.read().decode()}")
