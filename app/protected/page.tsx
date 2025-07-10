import { createClient } from "@/lib/supabase/serve";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>보호된 페이지</h1>
      <p>환영합니다, {user.email}!</p>
    </div>
  );
}
