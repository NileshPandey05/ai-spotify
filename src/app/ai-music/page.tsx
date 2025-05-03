import { Vortex } from "@/components/ui/vortex";

export default function AiMusicPage() {
    return(
        <div className="w-full h-screen">
            <Vortex
                backgroundColor="black"
                rangeY={800}
                particleCount={500}
                baseHue={120}
                className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
            >
            </Vortex>
        </div>
    )
}