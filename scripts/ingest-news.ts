import { ingestNews } from "../src/lib/news";

const result = await ingestNews();

console.log(
  JSON.stringify(
    {
      ok: true,
      ...result,
      finishedAt: new Date().toISOString()
    },
    null,
    2
  )
);
