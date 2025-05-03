// interface ButtonInput {
//     text: string
// }

// export default function Button({text}: ButtonInput){
//     return(
//         <button className="cursor-pointer mt-6 p-4 font-sans bg-[#1ED760] w-[350px] rounded-4xl ">{text}</button>
//     )
// }

// components/Button.tsx
interface ButtonInput {
  text: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({ text, type = "button" }: ButtonInput) {
  return (
    <button type={type} className="cursor-pointer mt-6 p-4 font-sans bg-[#1ED760] w-[350px] rounded-4xl">
      {text}
    </button>
  );
}
