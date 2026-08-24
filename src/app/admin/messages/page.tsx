import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-100">Messages</h1>
      <p className="mt-2 text-sm text-zinc-400">
        What visitors wrote on the contact form.
      </p>
      {messages.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No messages yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-zinc-100">{item.name}</p>
                <time className="text-xs text-zinc-500">
                  {item.createdAt.toLocaleString()}
                </time>
              </div>
              <a
                href={`mailto:${item.email}`}
                className="mt-1 block text-sm text-cyan-300 hover:underline"
              >
                {item.email}
              </a>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {item.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
