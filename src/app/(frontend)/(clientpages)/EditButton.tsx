"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { fetchWebsiteById } from "@/hooks/slices/websites/WebsiteSlice";
import { PageModel } from "@/types/pages/PageModel";
import { AppDispatch, RootState } from "@/store/store";
import { fetchLLMSettingByWebsiteId } from "@/hooks/slices/setting/llmSetting/LLMSettingSlice";

export default function EditButton({ pageData }: { pageData: PageModel }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();


  const {user}= useSelector((state:RootState)=>state.user)
  const {currentWebsite}= useSelector((state:RootState)=>state.websites)
   const {currentLLMSetting}= useSelector((state:RootState)=>state.llmSetting)
  useEffect(() => {
    if (pageData?.websiteId && !currentWebsite) {
      dispatch(fetchWebsiteById(pageData.websiteId));
      dispatch(fetchLLMSettingByWebsiteId({websiteId:pageData.websiteId}))
    }
  }, [pageData?.websiteId,currentWebsite, dispatch]);



  // fetch the LLM setting 
  // useEffect(()=>{
  //   if(!currentLLMSetting &&
  //     currentWebsite &&
  //   currentWebsite._id){
  //     dispatch(fetchLLMSettingByWebsiteId({websiteId:currentWebsite._id}))
  //   }
  // },[currentLLMSetting,currentWebsite])
  
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
