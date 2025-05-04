'use client';
import { useStackApp } from "@stackframe/stack";

export default function CustomOAuthSignIn() {
  const app = useStackApp();

  return (
    <div className="text-center mr-18 mt-1 font-bold ">
      <button onClick={async () => {
        // This will redirect to the OAuth provider's login page.
        await app.signInWithOAuth('google');
      }}>
        Sign Up with Google
      </button>
    </div>
  );
}
