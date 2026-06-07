"use client";

import { useEffect, useState } from "react";
import {
  apiErrorMessage,
  membersApi,
  memberColor,
  memberInitials,
  type ApiMember,
} from "@/lib/api";
import { MEMBERS_CHANGED, emitChange, onChange } from "@/lib/events";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { PlusIcon } from "@/components/icons";

function MemberCard({
  member,
  onDelete,
}: {
  member: ApiMember;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <article className="flex items-center gap-4 rounded-xl border border-line bg-elevated p-4">
      <Avatar
        initials={memberInitials(member.name)}
        color={memberColor(member.id)}
        size="lg"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {member.name}
        </p>
        <p className="truncate text-xs text-slate-400">{member.role}</p>
      </div>
      <button
        type="button"
        onClick={() =>
          confirming ? onDelete(member.id) : setConfirming(true)
        }
        onMouseLeave={() => setConfirming(false)}
        className="focus-ring shrink-0 rounded-md px-2 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
      >
        {confirming ? "Confirm" : "Remove"}
      </button>
    </article>
  );
}

export function TeamList() {
  const [members, setMembers] = useState<ApiMember[] | null>(null);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let active = true;
    const load = () => {
      membersApi
        .list()
        .then((data) => {
          if (!active) return;
          setMembers(data);
          setError(false);
        })
        .catch(() => active && setError(true));
    };
    load();
    const off = onChange(MEMBERS_CHANGED, load);
    return () => {
      active = false;
      off();
    };
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const role = String(form.get("role") ?? "").trim();
    try {
      await membersApi.create(name, role);
      emitChange(MEMBERS_CHANGED);
      toast.success("Member added");
      setAdding(false);
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not add the member."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(id: string) {
    membersApi
      .remove(id)
      .then(() => {
        toast.success("Member removed");
        emitChange(MEMBERS_CHANGED);
      })
      .catch((err) =>
        toast.error(apiErrorMessage(err, "Could not remove the member.")),
      );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Team
          </h1>
          <p className="mt-2 text-slate-400">
            People you can assign tasks to.
          </p>
        </div>
        <Button
          leftIcon={<PlusIcon />}
          onClick={() => {
            setFormError(null);
            setAdding(true);
          }}
        >
          Add member
        </Button>
      </header>

      {error ? (
        <p className="text-sm text-slate-500">Could not load the team.</p>
      ) : !members ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner />
          Loading team…
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-5 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No team members yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add members so you can assign them to tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add team member"
        description="Add someone you can assign tasks to."
        footer={
          <>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" form="member-form" disabled={submitting}>
              {submitting ? "Adding…" : "Add member"}
            </Button>
          </>
        }
      >
        <form id="member-form" onSubmit={handleAdd} className="space-y-4">
          {formError ? (
            <p
              role="alert"
              className="rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            >
              {formError}
            </p>
          ) : null}
          <Input label="Name" name="name" placeholder="e.g. John" required autoFocus />
          <Input label="Role" name="role" placeholder="e.g. Developer" required />
        </form>
      </Modal>
    </div>
  );
}
