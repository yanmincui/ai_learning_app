import { AppShell } from "@/components/AppShell";
import { courseDays, getTodayCourse } from "@/lib/course";
import { getNewsItems } from "@/lib/news";

export default async function Home() {
  const newsItems = await getNewsItems(30);

  return (
    <AppShell
      courseDays={courseDays}
      newsItems={newsItems}
      today={getTodayCourse()}
      updatedAt={new Date().toISOString()}
    />
  );
}
