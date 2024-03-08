import { Header } from "./Header";

export function HeaderRoute(props: { children: any }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1">
        <main className="h-full">{props.children}</main>
      </div>
    </div>
  );
}
