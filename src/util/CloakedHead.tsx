import { Helmet } from "react-helmet";

interface Props {
  originalTitle: string;
  originalFavicon: string;
}

const CloakedHead = (props: Props) => {
  var isTitleCloaked =
    localStorage.getItem("cloakTitle") !== null
      ? localStorage.getItem("cloakTitle") !== "none"
      : false;

  var isFaviconCloaked =
    localStorage.getItem("cloakFavicon") !== null
      ? localStorage.getItem("cloakFavicon") !== "none"
      : false;

  return (
    <Helmet>
      <title>
        {isTitleCloaked
          ? localStorage.getItem("cloakTitle")
          : props.originalTitle}
      </title>
      <link
        rel="icon"
        href={
          isFaviconCloaked
            ? localStorage.getItem("cloakFavicon")
            : props.originalFavicon
        }
      />
    </Helmet>
  );
};

export default CloakedHead;
