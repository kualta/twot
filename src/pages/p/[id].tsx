import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { PostContent, PostInfo } from "~/components/PostView";
import PostWizard from "~/components/PostWizard";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
	const {
		data,
		isError,
		error,
	} = api.posts.get.useQuery({postId: id}, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: false,
	});
	const router = useRouter();

	if (isError) return <ErrorPage title={error.data?.code ?? "Something went wrong..."} />;
	if (data?.length !== 1) return <ErrorPage title={"Something went wrong..."} />;

	const post = data[0]
	if (!post) return <ErrorPage title={"Post not found qwq"} />;

	const author = post.author;
	const replies = api.posts.get.useQuery({repliedToPostId: id});

	return (
		<>
			<Head>
				<title>
					@{author?.username}: {post.content}
				</title>
			</Head>

			<PageLayout>
				<div className=" flex w-full flex-col items-center justify-center p-2">
					<div className="rounded-box flex h-fit w-full grow flex-row gap-4 border border-b-0 border-base-200 border-primary p-4">
						<div className="shrink-0 grow-0 w-12 h-12">
							<UserAvatar profile={author} />
						</div>

						<div className="flex max-w-lg grow flex-col">
							<PostInfo post={post} />
							<PostContent post={post} collapsed={false} />
						</div>
						{/* <LikeButton post={post} /> */}
					</div>

					<div className="flex w-full flex-row ">
						<div className="place-end my-1 flex grow flex-col px-4">
							<Feed {...replies} />
							<PostWizard replyingTo={id} placeholder="reply..." />
						</div>
					</div>

					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => router.back()}
					>
						{"< Back "}
					</button>
				</div>
			</PageLayout>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const ssg = getSSGHelper();
	const id = context.params?.id;

	if (typeof id !== "string") throw new Error("Bad post id");

	await ssg.posts.get.prefetch({postId: id});

	return {
		props: {
			trpcState: ssg.dehydrate(),
			id: id,
		},
	};
};

export const getStaticPaths = () => {
	return { paths: [], fallback: "blocking" };
};

export default PostPage;
