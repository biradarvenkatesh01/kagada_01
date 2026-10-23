import { cn } from "@/lib/utils";

/**
 * Solid "Registrations Closed!" notice shared by every former Register button,
 * styled like the original hero "Register Now!" CTA but non-interactive.
 */
export function RegistrationsClosed({ className }: { className?: string }) {
  return (
    <p
      role="status"
      className={cn(
        "px-4 sm:px-5 py-2 sm:py-2.5 bg-[#5A182B] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs min-[360px]:text-sm sm:text-[15px] uppercase tracking-wider sm:tracking-widest shadow-xl shadow-black/35 flex items-center justify-center !rounded-none select-none whitespace-nowrap text-center",
        className
      )}
    >
      Registrations Closed!
    </p>
  );
}

export default RegistrationsClosed;
