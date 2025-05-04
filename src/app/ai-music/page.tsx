"use client"

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Vortex } from "@/components/ui/vortex";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MusicGenModel {
  id: string;
  name: string;
}

const AiMusicPage = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mashupUrl, setMashupUrl] = useState<string | null>(null);
  const [models, setModels] = useState<MusicGenModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("facebook/musicgen-small");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [guidanceScale, setGuidanceScale] = useState<number>(3.0);
  const [duration, setDuration] = useState<number>(30);

  useEffect(() => {
    // Fetch available models
    const fetchModels = async () => {
      try {
        const response = await axios.get("http://localhost:8000/models");
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
        toast.error("Failed to fetch available models");
      }
    };
    fetchModels();
  }, []);

  const handleUpload = async () => {
    if (!file1 || !file2) {
      toast.error("Please select both audio files");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setMashupUrl(null);

    try {
      // Upload files
      const formData = new FormData();
      formData.append("file1", file1);
      formData.append("file2", file2);

      const uploadResponse = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(progress);
        },
      });

      // Process files
      const processResponse = await axios.post("http://localhost:8000/process", {
        file1: uploadResponse.data.file1,
        file2: uploadResponse.data.file2,
      });

      // Generate mashup
      const mashupResponse = await axios.post("http://localhost:8000/generate-mashup", {
        vocals: processResponse.data.vocals,
        instrumentals: processResponse.data.instrumentals,
        model: selectedModel,
        temperature: temperature,
        guidance_scale: guidanceScale,
        duration: duration,
      });

      setMashupUrl(mashupResponse.data.mashup_url);
      toast.success("Mashup generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate mashup");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex flex-col items-center justify-center px-4 md:px-20 py-6 w-full h-full"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">AI Music Lab 🎧</h1>
        <h2 className="text-xl md:text-2xl text-gray-300 mb-6 text-center">
          <Typewriter
            words={[
              "Create your own music mashups 🎶",
              "Generate AI-powered tracks 🤖",
              "Remix songs with one click 🔁",
              "Explore your creative soundscape 🎼"
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1000}
          />
        </h2>

        <div className="w-full max-w-2xl space-y-6 bg-black/50 p-6 rounded-lg backdrop-blur-sm">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Audio File</label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile1(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Second Audio File</label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile2(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperature: {temperature}
                </label>
                <Slider
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Guidance Scale: {guidanceScale}
                </label>
                <Slider
                  value={[guidanceScale]}
                  onValueChange={(value) => setGuidanceScale(value[0])}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (seconds): {duration}
                </label>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={5}
                  max={120}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isProcessing || !file1 || !file2}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? "Processing..." : "Generate Mashup"}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-400 text-center">
                {progress < 25 && "Uploading files..."}
                {progress >= 25 && progress < 50 && "Processing audio..."}
                {progress >= 50 && progress < 75 && "Creating mashup..."}
                {progress >= 75 && "Finalizing..."}
              </p>
            </div>
          )}

          {mashupUrl && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Mashup</h2>
              <audio controls className="w-full">
                <source src={mashupUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <Button
                onClick={() => window.open(mashupUrl, "_blank")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Download Mashup
              </Button>
            </div>
          )}
        </div>
      </Vortex>
    </div>
  );
};

export default AiMusicPage;