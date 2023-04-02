import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { UserAvatar } from "./UserAvatar";
import { MenuItem } from "./MenuItem";
import { FiLogIn } from "react-icons/fi";

export default function PostWizard() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.invalidate();
    },
    onError: (e) => {
      let errorText = e.data?.zodError?.fieldErrors.content;
      if (!errorText) {
        toast.error("Failed to post. Try again.");
      } else {
        toast.error(errorText[0]!);
      }
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ content: input });
  };

  const postButton = isPosting ? (
    <>
      <div className="loading btn-outline btn w-16"></div>
    </>
  ) : (
    <>
      {input !== "" && (
        <button className="btn-outline btn-primary btn w-16" type="submit">
          Post
        </button>
      )}
    </>
  );

  const { signOut, openSignIn } = useClerk();
  if (!user) return (
    <>
      <div className="flex flex-row items-center">
          <button 
          onClick={(e) => {openSignIn()}} 
          className="btn btn-ghost btn-primary m-2">
            {`Sign in to Post `}
            <FiLogIn className="ml-2" size={24} />
          </button>
      </div>
    </>
  );

  return (
    <div className="sticky top-0 z-10 flex flex-col ">
      <div className="z-10 flex flex-row gap-4 bg-base-100 p-4">
        <UserAvatar />
        <form className="flex w-full flex-row gap-4" onSubmit={onSubmit}>
          <input
            type="text"
            className="input-bordered input-ghost input shrink grow"
            placeholder="write a new twot?.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPosting}
          />
          {postButton}
        </form>
      </div>
      <div
        className="divider m-0 bg-base-100/[.5] 
                  before:h-0 before:border-b before:border-base-300 before:bg-base-300 
                  after:h-0 after:border-b after:border-base-300 after:bg-base-300"
      >
        Global
      </div>
    </div>
  );
}
