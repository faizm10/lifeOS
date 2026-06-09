"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui";

export function Topbar({ title }: { title: string }) {
  const { data: session } = useSession();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toUTCString().replace("GMT", "UTC")
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-hairline bg-panel/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          § {title}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden font-mono text-[10px] text-dim sm:inline">
          {clock}
        </span>
        <span className="font-mono text-xs text-muted">
          {session?.user?.email ?? "operator"}
        </span>
        <Button
          type="button"
          onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
