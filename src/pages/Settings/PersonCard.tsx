interface props {
  name: string;
  url: string;
  profile: string;
}

export const PersonCard = (props) => {
  return (
    <div class="mr-8 flex flex-row">
      <p className="text-lg">
        <a href={props.url} class="underline">
          <img src={props.profile} className="h-12 w-12 rounded-md" />
          {props.name}
        </a>
      </p>
    </div>
  );
};
