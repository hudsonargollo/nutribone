"use client";

import { useActionState } from "react";
import { requestMagicLinkAction, type MagicLinkState } from "@/app/(store)/auth-actions";
import { AuthAlert, AuthField, AuthSubmit, useAuthForm } from "./auth-field";
import { emailError } from "@/lib/auth-rules";

const initial: MagicLinkState = {};

// Passwordless sign-in: just the email — the access link arrives by mail.
export function MagicLinkForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(requestMagicLinkAction, initial);
  const [formRef, f] = useAuthForm(formAction, state, { email: emailError });
  const email = f.field("email");

  return (
    <form ref={formRef} action={formAction} onSubmit={f.onSubmit} noValidate className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <p className="rounded-xl border border-accent/50 bg-accent/10 px-3.5 py-3 text-center text-sm text-ink">
        Escribe solo tu correo: te enviamos un enlace para entrar sin contraseña (vence en 24 h).
      </p>

      <AuthField
        name="email"
        label="Correo electrónico"
        icon="mail"
        type="email"
        autoComplete="email"
        placeholder="tu@ejemplo.com"
        {...f.bind("email")}
        {...email}
      />

      {state.error && <AuthAlert>{state.error}</AuthAlert>}
      {state.ok && state.message && (
        <div role="status" className="rounded-xl border border-ok/40 bg-ok/[0.08] px-3.5 py-3 text-sm text-ink">
          {state.message}
        </div>
      )}

      <AuthSubmit pending={pending} label="Enviar enlace" pendingLabel="Enviando…" />
    </form>
  );
}
