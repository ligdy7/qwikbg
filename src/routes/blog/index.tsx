import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";

import type { Post } from "~/types";
import { fetchPosts } from "~/utils/posts";
import { SITE } from "~/config.mjs";

export default component$(() => {
  const store = useStore<{ posts: Post[] }>({
    posts: [],
  });

  useTask$(async () => {
    if (isServer) {
      const posts = await fetchPosts();
      store.posts = posts.map((post: Post) => ({ ...post }));
    }
  });

  return (
    <section class="px-6 sm:px-6 py-12 mx-auto max-w-3xl">
      <ul>
        {store.posts.map((post: any) => (
          <li key={post.slug} class="mb-6">
            <article class={`max-w-md mx-auto md:max-w-none grid gap-6 md:gap-8 ${post.image ? "md:grid-cols-2" : ""}`}>
              {post.image && (
                <a class="relative block group" href={`/blog/${post.slug}`}>
                  <div class="relative h-0 pb-[50%] overflow-hidden bg-gray-100 dark:bg-slate-700 rounded">
                    {post.image && (
                      <Image
                        src={post.image}
                        class="absolute inset-0 object-cover w-full mb-6 rounded"
                        alt={post.title}
                        width={400}
                      />
                    )}
                  </div>
                </a>
              )}
              <div>
                <header>
                  <h2 class="text-xl font-bold leading-snug mb-2 font-heading">
                    <a
                      class="hover:text-primary-600 underline underline-offset-4 decoration-1 decoration-dotted transition ease-in duration-200"
                      href={`/blog/${post.slug}`}
                    >
                      {post.title}
                    </a>
                  </h2>
                </header>
                <p class="text-md sm:text-lg flex-grow ">{post.excerpt || post.description}</p>
                <footer class="mt-4">
                  <div>
                    <span class="text-gray-500 dark:text-slate-400">
                      <time dateTime={String(post.publishDate.getTime())}>
                        {post.publishDate.toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                      </time>
                      ~{' '}{Math.ceil(post.readingTime)} min read
                    </span>
                  </div>
                  <div class="mt-4">{/* <PostTags tags={post.tags} /> */}</div>
                </footer>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
});

export const head: DocumentHead = {
  title: "fsyud | Blog",
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
