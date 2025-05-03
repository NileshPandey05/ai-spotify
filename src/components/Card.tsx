interface CardInput {
  label: string
  type: string
  placeholder: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Card({ label, type, placeholder, name, value, onChange }: CardInput) {
  return (
    <div className="flex flex-col font-sans mt-6 w-[350px]">
      <label className="font-bold tracking-widest">{label}</label>
      <input
        className="p-4 border mt-2 border-white"
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
