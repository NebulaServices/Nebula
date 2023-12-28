import { Header } from "./Header";

export function HeaderRoute(props: { children: any }) {
  return (
    <div class="flex h-screen flex-col">
      <Header />
      <div class="flex-1 bg-primary">
        <main class="h-full">{props.children}</main>
      </div>
    </div>
  );
}
