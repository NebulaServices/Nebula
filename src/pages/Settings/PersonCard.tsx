interface props {
  name: string;
  url: string;
  profile: string;
}

export const PersonCard = (props) => {
  return (
    <div class="flex flex-row mr-8">
      <p className="text-lg">
        <a href={props.url} class="underline">
          <img src={props.profile} className="h-12 w-12 rounded-md" />
          {props.name}
        </a>
      </p>
    </div>
  );
};
