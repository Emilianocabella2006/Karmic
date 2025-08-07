// utils/parseText.ts
import Link from "next/link";

export function parseText(text: string) {
  const regex = /(@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.substring(1);
      return (
        <Link
          key={index}
          href={`/profile/${username}`}
          className="text-blue-600 hover:underline"
        >
          {part}
        </Link>
      );
    }

    if (part.startsWith("#")) {
      const tag = part.substring(1);
      return (
        <Link
          key={index}
          href={`/hashtag/${tag}`}
          className="text-blue-500 hover:underline"
        >
          {part}
        </Link>
      );
    }

    return part;
  });
}
