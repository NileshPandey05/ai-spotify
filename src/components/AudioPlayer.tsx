import { useState } from "react";

export default function AiMusicPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [mashupUrl, setMashupUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleMashup = async () => {
    if (!file1 || !file2) return;
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/mashup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create mashup");
      }

      const data = await response.json();
      setMashupUrl(`${apiUrl}${data.url}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, setFile1)} />
      {file1 && <p>Selected file 1: {file1.name}</p>}

      <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, setFile2)} />
      {file2 && <p>Selected file 2: {file2.name}</p>}

      <button 
        onClick={handleMashup} 
        disabled={!file1 || !file2 || loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Create Mashup"}
      </button>

      {mashupUrl && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold mb-2">Mashup Created!</h2>
          <audio controls className="w-full max-w-md">
            <source src={mashupUrl} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
          <a href={mashupUrl} download className="block mt-2 text-blue-400 underline">
            Download Mashup
          </a>
        </div>
      )}
    </div>
  );
}
