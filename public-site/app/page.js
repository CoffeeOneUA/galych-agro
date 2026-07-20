import { getContent } from "../lib/db";
import { defaultContent } from "../lib/defaultContent";
import Site from "../components/Site";

export const dynamic = "force-dynamic";

export default async function Home() {
  let content;
  try {
    content = await getContent();
  } catch (err) {
    console.error("Home: falling back to default content:", err);
    content = defaultContent();
  }
  return <Site content={content} />;
}
