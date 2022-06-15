import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No table selected. Select a table on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new table.
      </Link>
    </p>
  );
}
