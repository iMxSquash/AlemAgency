import type { ContentSection } from "@/types";

export function Section({ section }: { section: ContentSection }) {
  switch (section.type) {
    case "text":
      return <p className="leading-relaxed text-gray-700">{section.content}</p>;

    case "list":
      return (
        <div>
          {section.title && <h3 className="mb-2 font-semibold text-gray-900">{section.title}</h3>}
          <ul className="list-disc space-y-1 pl-5">
            {section.items.map((item) => (
              <li key={item} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "steps":
      return (
        <div>
          {section.title && <h3 className="mb-2 font-semibold text-gray-900">{section.title}</h3>}
          <ol className="list-decimal space-y-1 pl-5">
            {section.items.map((item) => (
              <li key={item} className="text-gray-700">
                {item}
              </li>
            ))}
          </ol>
        </div>
      );

    case "tip":
      return (
        <div className="rounded-r border-l-4 border-blue-400 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">{section.content}</p>
        </div>
      );

    case "warning":
      return (
        <div className="rounded-r border-l-4 border-amber-400 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">{section.content}</p>
        </div>
      );
  }
}
