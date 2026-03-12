'use client'

interface LiveVideoProps {
  facebookUrl: string
  title?: string
}

export default function LiveVideo({ facebookUrl, title }: LiveVideoProps) {
  // Extract video ID or URL for embedding
  // Facebook URL format can vary, but we can use the full URL in the data-href
  
  return (
    <div className="w-full max-w-4xl mx-auto my-8 overflow-hidden rounded-2xl shadow-2xl border border-primary/20 bg-black aspect-video relative group">
      <iframe 
        src={`https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(facebookUrl)}&show_text=false&width=476&t=0`} 
        width="100%" 
        height="100%" 
        style={{ border: 'none', overflow: 'hidden' }} 
        scrolling="no" 
        frameBorder="0" 
        allowFullScreen={true} 
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        className="absolute inset-0 w-full h-full"
      ></iframe>
      <div className="absolute top-4 right-4 z-10">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full"></span>
          بث مباشر فيسبوك
        </span>
      </div>
    </div>
  )
}
