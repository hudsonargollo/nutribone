"use client";

import { useActionState } from "react";
import { setPasswordAction, type AuthState } from "@/app/(store)/auth-actions";
import { AuthField, AuthSubmit, PasswordStrength, useAuthForm } from "@/components/auth/auth-field";
import { newPasswordError } from "@/lib/auth-rules";

const initial: AuthState = {};

// For passwordless accounts (created by guest checkout): pick a password so
// future sign-ins don't need the emailed magic link.
export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPasswordAction, initial);
  const [formRef, f] = useAuthForm(formAction, state, { password: newPasswordError });
  const password = f.field("password", { positive: false });

  return (
    <form ref={formRef} action={formAction} onSubmit={f.onSubmit} noValidate className="mt-3 space-y-3">
      <AuthField
        name="password"
        label="Nueva contraseña"
        icon="lock"
        password
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        {...f.bind("password")}
        {...password}
      >
        <PasswordStrength value={f.value("password")} highlight={password.status === "invalid"} />
      </AuthField>

      {state.error && (
        <p className="rounded-md border border-bad/30 bg-bad/[0.06] px-3 py-2 text-sm text-bad">{state.error}</p>
      )}

      <div className="max-w-xs">
        <AuthSubmit pending={pending} label="Guardar contraseña" pendingLabel="Guardando…" />
      </div>
    </form>
  );
}
