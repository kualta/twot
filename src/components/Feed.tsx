import { api } from "~/utils/api";
import PostWizard from "./PostWizard";
import { PostView } from "./PostView";

export default function Feed() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  let suspense = (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="loading btn"> loading...</div>
    </div>
  );
  let feed = data ? (
    data.map((post) => (
      <PostView key={post.id} post={post}/>
    ))
  ) : (
    <div className="btn-error btn">
      something went wrong... terribly wrong...
    </div>
  );
  let content = isLoading ? suspense : feed;

  return (
    <div className="min-h-full w-full max-w-2xl shrink-0 grow border-x-2 border-slate-900 sm:shrink">
      <PostWizard />
      <div className="divider">Global</div>
      {content}
    </div>
  );
}