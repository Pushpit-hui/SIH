import { Content, fetchOneEntry } from "@builder.io/sdk-react-nextjs";

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

export default async function Page() {
  const content = await fetchOneEntry({
    model: "page",
    apiKey: BUILDER_API_KEY,
    userAttributes: {
      urlPath: "/",
    },
  });

  if (!content) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Builder content not found</h1>
        <p>
          Next.js is connected, but Builder does not have a published page
          available at "/".
        </p>
      </div>
    );
  }

  return (
    <Content
      model="page"
      content={content}
      apiKey={BUILDER_API_KEY}
    />
  );
}