import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Copy, RotateCw, Trash2 } from "lucide-react";
import Image from "next/image";
import DownloadButton from "./DownLoadBtn";
import VideoPlayerCarousel from "./VideoPlayer";
import DeletePromt from "./DeletePromt";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/Silce";

type ImageCarouselType = {
  children: React.ReactElement;
  index: number;
};

export default function ImageCarousel({ children, index }: ImageCarouselType) {
  const [rotateDeg, setRotate] = useState<number>(0);
  const { fileType, fileUrls, download } = useSelector((state: StoreState) => state);

  const rotateImg = () => {
    setRotate((pre) => pre + 90);
  };

  const copyURL = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Success!!", { description: "Copy TO ClipBoard!!" });
    } catch {
      toast("Error!!", { description: "Fail To Copy!!" });
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <div className="hidden">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </div>
        <DialogContent className="flex justify-center items-center max-h-[70vh]">
          <Carousel opts={{ startIndex: index }} className="w-full mx-auto mt-4">
            <CarouselContent>
              {fileUrls.map((url, index) => {
                const piptype = fileType === "image" ? "png" : "mp4";
                return (
                  <CarouselItem key={index || 0} className="max-h-[65vh]">
                    <div className="w-full h-[6%] flex justify-between items-center px-4 my-2">
                      <button onClick={() => rotateImg()}>
                        <RotateCw />
                      </button>
                      {download ? (
                        <div className="flex gap-4 items-center">
                          <DownloadButton imageUrl={url} fileName={`d-cloud-download-${fileType}-${index}.${piptype}`} />
                          <Copy onClick={() => copyURL(url)} />
                          <DeletePromt urls={[url]}>
                            <Trash2 stroke="red" />
                          </DeletePromt>
                        </div>
                      ) : (
                        <DeletePromt urls={[url]}>
                          <Trash2 stroke="red" />
                        </DeletePromt>
                      )}
                    </div>
                    <div className="flex justify-center items-center bg-black h-[90%] w-full rounded-lg overflow-clip">{fileType === "video" ? <VideoPlayerCarousel rotateDeg={rotateDeg} key={index} url={url} /> : <Image width={1000} height={1000} style={{ rotate: `${rotateDeg}deg` }} src={url} alt="Uploaded" className=" w-full h-full object-contain rounded-lg " />}</div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
