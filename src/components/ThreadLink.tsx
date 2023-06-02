import { useDispatch } from "react-redux";

export const ThreadLink = (props: { id: string; title: string | null }) => {
  let setCurrentThread = useDispatch();
  return (
    <button
      onClick={() =>
        setCurrentThread({ type: "SET_CURRENT_THREAD", payload: props.id })
      }
      className="hover:underline"
    >
      {props.title}
    </button>
  );
};