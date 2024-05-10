import { useRef, useEffect } from "preact/hooks";

export default function Video({ src, isMuted }) {
  const refVideo = useRef(null);

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    if (isMuted) {
      //open bug since 2017 that you cannot set muted in video element https://github.com/facebook/react/issues/10389
      refVideo.current.defaultMuted = true;
      refVideo.current.muted = true;
    }

    refVideo.current.srcObject = src;
  }, [src]);

  return (
    <video
      ref={refVideo}
      autoPlay
      playsInline //FIX iOS black screen
      className="relative z-10 h-screen w-full"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
