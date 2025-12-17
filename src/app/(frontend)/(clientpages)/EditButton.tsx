"use client";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { PageModel } from "@/types/pages/PageModel";

export default function EditButton({ pageData }: { pageData: PageModel }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(setPageEdit(pageData));
    router.push("/builder");
  };

  return (
    <header className="w-full bg-black">
      <div className="flex h-14 items-center justify-center">
        <button
        onClick={handleClick}
          className="rounded border border-white px-5 py-2 text-sm font-semibold text-white
                     hover:bg-white hover:text-black transition"
        >
          Edit in Builder
        </button>
      </div>
    </header>
  );
}
