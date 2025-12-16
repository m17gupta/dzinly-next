"use client";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { PageModel } from "@/types/pages/PageModel";

export default function EditButton({ pageData }: { pageData:PageModel }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {

    dispatch(setPageEdit(pageData));
    router.push("/builder");
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={handleClick}
    >
      Edit in Builder
    </button>
  );
}
